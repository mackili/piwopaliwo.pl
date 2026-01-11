import { solve, equalTo, greaterEq, inRange } from "yalps";
import type { Model, Solution, Constraint } from "yalps";

type Balances = Record<string, number>;
type Transfer = { from: string; to: string; amount: number };

/**
 * Convert currency units to integer "cents" using the requested rule:
 * multiply by 100 and Math.ceil(), while preserving the sign and ceiling magnitude.
 */
function toCentsCeil(value: number): number {
    if (!Number.isFinite(value)) return 0;
    const scaledAbs = Math.ceil(Math.abs(value) * 100);
    return value >= 0 ? scaledAbs : -scaledAbs;
}

function fromCents(value: number): number {
    return Number((value / 100).toFixed(2));
}

/**
 * After per-person ceil rounding, sum may drift away from 0.
 * Normalize by adjusting a single participant so total sum becomes 0.
 */
function normalizeRoundedToZeroSum(
    people: Array<[string, number]>
): Array<[string, number]> {
    const sum = people.reduce((acc, [, v]) => acc + v, 0);
    if (sum === 0) return people;

    // Prefer adjusting someone on the side of the drift to avoid sign flips.
    // If sum > 0, reduce a creditor; if sum < 0, increase a debtor.
    const wantPositive = sum > 0;

    let idx = -1;
    let bestAbs = -1;

    for (let i = 0; i < people.length; i++) {
        const v = people[i][1];
        if (wantPositive ? v > 0 : v < 0) {
            const av = Math.abs(v);
            if (av > bestAbs) {
                bestAbs = av;
                idx = i;
            }
        }
    }

    // Fallback: adjust the largest magnitude entry.
    if (idx === -1) {
        for (let i = 0; i < people.length; i++) {
            const av = Math.abs(people[i][1]);
            if (av > bestAbs) {
                bestAbs = av;
                idx = i;
            }
        }
    }

    if (idx === -1) return people;

    const [name, v] = people[idx];
    const adjusted = v - sum; // makes total sum 0
    const copy = people.slice();
    copy[idx] = [name, adjusted];
    return copy;
}

/**
 * Minimizes the number of transactions needed to settle given net balances.
 *
 * Convention:
 *  - balance > 0  => person should RECEIVE money
 *  - balance < 0  => person should PAY money
 */
export function optimizeTransactions(balances: Balances): {
    data: Transfer[] | null;
    error: string | null;
} {
    // Round to integer cents (ceil), then normalize to keep feasibility (sum must be 0)
    let people: Array<[string, number]> = Object.entries(balances).map(
        ([person, amount]) => [person, toCentsCeil(amount)]
    );
    people = normalizeRoundedToZeroSum(people);

    // Drop zeros to reduce problem size
    people = people.filter(([, amount]) => amount !== 0);

    const debtors = people.filter(([, amount]) => amount < 0); // payers
    const creditors = people.filter(([, amount]) => amount > 0); // receivers

    // Trivial case
    if (debtors.length === 0 || creditors.length === 0) {
        return { data: [], error: null };
    }

    const variables: Record<string, Record<string, number>> = {};
    const integers: string[] = [];
    const constraints: Map<string, Constraint> = new Map();

    // Create only debtor -> creditor arcs (reduces vars from n^2 to |D|*|C|)
    for (const [dName, dAmount] of debtors) {
        for (const [cName, cAmount] of creditors) {
            const yName = `use_${dName}_${cName}`; // binary
            const xName = `amt_${dName}_${cName}`; // integer cents

            // y in {0,1}
            const yBound = `bin_${yName}`;
            constraints.set(yBound, inRange(0, 1));
            variables[yName] = { transactionCount: 1, [yBound]: 1 };
            integers.push(yName);

            // x >= 0
            constraints.set(xName, greaterEq(0));
            variables[xName] = { transactionCount: 0 };
            integers.push(xName);

            // Tight Big-M per arc: x <= min(owe, receive) * y
            const Mij = Math.min(Math.abs(dAmount), cAmount);

            const ubKey = `ub_${dName}_${cName}`; // x - Mij*y <= 0
            constraints.set(ubKey, inRange(Number.NEGATIVE_INFINITY, 0));
            variables[xName][ubKey] = 1;
            variables[yName][ubKey] = -Mij;

            // If used then at least 1 cent: x - 1*y >= 0
            const lbKey = `lb_${dName}_${cName}`;
            constraints.set(lbKey, greaterEq(0));
            variables[xName][lbKey] = 1;
            variables[yName][lbKey] = -1;
        }
    }

    // Debtors: sum out == -balance
    for (const [dName, dAmount] of debtors) {
        const key = `out_${dName}`;
        constraints.set(key, equalTo(Math.abs(dAmount)));

        for (const [cName] of creditors) {
            const xName = `amt_${dName}_${cName}`;
            variables[xName][key] = 1;
        }
    }

    // Creditors: sum in == balance
    for (const [cName, cAmount] of creditors) {
        const key = `in_${cName}`;
        constraints.set(key, equalTo(cAmount));

        for (const [dName] of debtors) {
            const xName = `amt_${dName}_${cName}`;
            variables[xName][key] = 1;
        }
    }

    const model: Model = {
        direction: "minimize",
        objective: "transactionCount",
        constraints,
        variables,
        integers,
    };

    const solution: Solution = solve(model);
    if (solution.status !== "optimal") {
        return { data: null, error: solution.status };
    }

    const transfers: Transfer[] = solution.variables
        .filter(([name, value]) => name.startsWith("amt_") && value > 0)
        .map(([name, value]) => {
            const parts = name.split("_"); // amt_{from}_{to}
            const from = parts[1];
            const to = parts[2];
            return { from, to, amount: fromCents(value) };
        });

    return { data: transfers, error: null };
}

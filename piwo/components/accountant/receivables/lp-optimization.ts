import { solve, equalTo, greaterEq, inRange } from "yalps";
import type { Model, Solution, Constraint } from "yalps";

type Balances = Record<string, number>;
type Transfer = { from: string; to: string; amount: number };

function getFromToTransaction(str: string) {
    const parts = str.split("_");
    const from = parts[parts.length - 2];
    const to = parts[parts.length - 1];

    return { from: from, to: to };
}

/**
 * Convert currency units to integer "cents" using the requested rule:
 * multiply by 100 and Math.ceil(), while preserving the sign and ceilling magnitude.
 */
function toCentsCeil(value: number): number {
    if (!Number.isFinite(value)) return 0;
    const scaledAbs = Math.ceil(Math.abs(value) * 100);
    return value >= 0 ? scaledAbs : -scaledAbs;
}

function fromCents(value: number): number {
    // Keep it stable as a 2-decimal currency value
    return Number((value / 100).toFixed(2));
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
    // Scale balances to integer cents (ceil) for the whole optimization
    const people: Array<[string, number]> = Object.entries(balances).map(
        ([person, amount]) => [person, toCentsCeil(amount)]
    );

    // Big-M for linking x (amount) with y (whether transfer is used)
    const absAmounts = people.map(([, amount]) => Math.abs(amount));
    const totalPositive = people.reduce(
        (sum, [, amount]) => sum + (amount > 0 ? amount : 0),
        0
    );
    const M = Math.max(1, totalPositive, ...absAmounts); // in cents

    const variables: Record<string, Record<string, number>> = {};
    const integers: string[] = [];

    const constraints: Map<string, Constraint> = new Map();

    /**
     * Adds binary constraints to the who pays who decision matrix
     */
    function addBinaryBounds() {
        for (const [p] of people) {
            for (const [q] of people) {
                if (p === q) continue;
                const yName = `who_pays_who_${p}_${q}`;
                const boundKey = `bin_${yName}`;
                constraints.set(boundKey, inRange(0, 1));
                if (!variables[yName]) variables[yName] = {};
                variables[yName][boundKey] = 1;
                integers.push(yName);
                variables[yName]["transactionCount"] = 1;
            }
        }
    }
    addBinaryBounds();

    /**
     * How much one should pay the other? (integer cents)
     */
    for (const [p] of people) {
        for (const [q] of people) {
            if (p === q) continue;
            const xName = `how_much_who_pays_who_${p}_${q}`;
            constraints.set(xName, greaterEq(0));
            variables[xName] = { transactionCount: 0 }; // does not affect objective
            integers.push(xName); // ensure cent-precision solutions
        }
    }

    /**
     * Debtors must pay exactly what they owe (in cents)
     */
    for (const [person, amount] of people) {
        if (amount >= 0) continue;

        const key = `out_${person}`;
        constraints.set(key, equalTo(Math.abs(amount)));

        for (const [other] of people) {
            if (other === person) continue;
            const xName = `how_much_who_pays_who_${person}_${other}`;
            variables[xName][key] = 1;
        }
    }

    /**
     * Creditors must receive exactly what they should (in cents)
     */
    for (const [person, amount] of people) {
        if (amount <= 0) continue;

        const key = `in_${person}`;
        constraints.set(key, equalTo(Math.abs(amount)));

        for (const [other] of people) {
            if (other === person) continue;
            const xName = `how_much_who_pays_who_${other}_${person}`;
            variables[xName][key] = 1;
        }
    }

    /**
     * Link "use transfer" binary y with paid amount x:
     *   0 <= x <= M*y
     *   x >= 1*y   (if y=1 then at least 1 cent)
     */
    for (const [p] of people) {
        for (const [q] of people) {
            if (p === q) continue;

            const yName = `who_pays_who_${p}_${q}`;
            const xName = `how_much_who_pays_who_${p}_${q}`;

            const ubKey = `ub_${p}_${q}`; // x - M*y <= 0
            constraints.set(ubKey, inRange(Number.NEGATIVE_INFINITY, 0));
            variables[xName][ubKey] = 1;
            variables[yName][ubKey] = -M;

            const lbKey = `lb_${p}_${q}`; // x - 1*y >= 0
            constraints.set(lbKey, greaterEq(0));
            variables[xName][lbKey] = 1;
            variables[yName][lbKey] = -1;
        }
    }

    const model: Model = {
        direction: "minimize",
        objective: "transactionCount",
        constraints: constraints,
        variables: variables,
        integers: integers,
    };

    const solution: Solution = solve(model);
    if (solution.status !== "optimal") {
        return { data: null, error: solution.status };
    }

    const transfers: Transfer[] = solution.variables
        .filter(
            ([name, value]) =>
                name.startsWith("how_much_who_pays_who_") && value > 0
        )
        .map(([name, value]) => ({
            ...getFromToTransaction(name),
            amount: fromCents(value), // back to decimals
        }));

    return { data: transfers, error: null };
}

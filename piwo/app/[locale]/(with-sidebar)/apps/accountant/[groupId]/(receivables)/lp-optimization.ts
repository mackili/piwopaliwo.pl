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
    const people: Array<[string, number]> = Object.entries(balances);
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
     * How much one should pay the other?
     */
    for (const [p] of people) {
        for (const [q] of people) {
            if (p === q) continue;
            const xName = `how_much_who_pays_who_${p}_${q}`;
            constraints.set(xName, greaterEq(0));
            variables[xName] = { transactionCount: 0 }; // does not affect objective
        }
    }

    /**
     * Debtors must pay exactly what they owe
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
     * Creditors must receive exactly what they should
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
     * If one pays, they must pay a non-zero value
     */
    const SMALL_O = 0.00001;

    for (const [p] of people) {
        for (const [q] of people) {
            if (p === q) continue;

            const yName = `who_pays_who_${p}_${q}`;
            const xName = `how_much_who_pays_who_${p}_${q}`;
            const linkKey = `link_${p}_${q}`;

            constraints.set(linkKey, greaterEq(0));

            // who - SMALL_O * how >= 0
            variables[yName][linkKey] = 1;
            variables[xName][linkKey] = -SMALL_O;
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
            amount: value,
        }));
    return { data: transfers, error: null };
    // for (const [name, value] of sol.variables) {
    //     if (!name.startsWith("how_much_who_pays_who_")) continue;
    //     if (value === 0) continue;
    //     transfers.push({
    //         amount: value,
    //     });
    //     console.log(name, "---", value);
    // }
}

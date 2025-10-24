"use server";

import NewBeer from "@/components/beercounter/new-beer";

export default async function Page() {
    return (
        <div className="w-full mt-50 h-screen">
            <div className="flex items-center justify-center-safe w-full">
                <NewBeer />
            </div>
        </div>
    );
}

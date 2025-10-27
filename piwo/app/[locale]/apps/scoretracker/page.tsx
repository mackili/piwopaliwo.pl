"use server";
import ScoredGamesList from "./games-list";
import JoinTrackerForm from "./join-form";

export default async function Page() {
    return (
        <div className="w-screen grid grid-cols-1 md:grid-cols-3 px-4 gap-4">
            <div className="max-w-md mx-auto flex flex-col gap-6 md:col-start-2">
                <JoinTrackerForm />
            </div>
            <div className="md:col-start-3 flex flex-col gap-8 h-screen">
                <ScoredGamesList />
            </div>
        </div>
    );
}

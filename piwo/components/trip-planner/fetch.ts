"use server";
import { Enums, TablesInsert, TablesUpdate } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

export type ParticipantResponseJson = {
    id: string;
    status: Enums<"trip_participant_status">;
    role: Enums<"trip_participant_role">;
    group_member: {
        id: string;
        nickname: string | null;
        status: Enums<"acc_group_user_status">;
    };
    user: {
        id: string | null;
        first_name: string | null;
        last_name: string | null;
        avatar_url: string | null;
    } | null;
};

interface TripTransactionSplitGeneral {
    trip_participant_id: string;
}

interface TripTransactionSplitSpecified extends TripTransactionSplitGeneral {
    share: number;
}

export type TripTransactionSplit = 

async function fetchTrips() {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    if (user.error) {
        return { data: null, error: user.error };
    }

    const response = await supabase
        .from("group")
        .select(
            `id, name, thumbnail_url, trips:trip(
            id,name,description,type,start_date,end_date,currency_iso_code,status,created_at, created_by, group_id, last_modified_at,last_modified_by, text_document_id
            )`,
        )
        .order("name", { ascending: true });
    return response;
}

async function fetchTripDetails(tripId: string) {
    const supabase = await createClient();

    return await supabase
        .from("v_trip_details")
        .select("*")
        .eq("id", tripId)
        .single()
        .overrideTypes<{
            participants: [ParticipantResponseJson];
            // text_document: TripTextDocument;
        }>();
}
async function upsertTrips(trips: TablesInsert<"trip">[]) {
    const supabase = await createClient();

    return await supabase
        .from("trip")
        .upsert(trips, { onConflict: "id" })
        .select();
}

async function updateParticipant(
    participant: TablesUpdate<"trip_participant">,
    participantId: string,
) {
    const supabase = await createClient();

    return await supabase
        .from("trip_participant")
        .update(participant)
        .eq("id", participantId);
}

async function inviteParticipants(
    participants: TablesInsert<"trip_participant">[],
) {
    const supabase = await createClient();
    const invitedParticipants = participants.map((participant) => ({
        ...participant,
        status: "invited" as Enums<"trip_participant_status">,
    }));
    return await supabase.from("trip_participant").insert(invitedParticipants);
}

export {
    fetchTrips,
    fetchTripDetails,
    upsertTrips,
    updateParticipant,
    inviteParticipants,
};

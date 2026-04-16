import { Enums, Tables } from "@/database.types";
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
    };
};
// export type TripTextDocument = {
//     id: string;
//     title: string | null;
//     markdown: string | null;
//     thumbnail_url: string | null;
//     banner_url: string | null;
//     type: Enums<"text_document_type">;
// };

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

export { fetchTrips, fetchTripDetails };

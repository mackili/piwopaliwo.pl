"use server";
import {
    Database,
    Enums,
    Tables,
    TablesInsert,
    TablesUpdate,
} from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import {
    TripAccommodationSummaryView,
    TripFinancialsJson,
    TripFinancialsParticipantsJson,
    TripFinancialsPerCategoryJson,
} from "./custom-schemas";

export type ParticipantResponseJson = {
    id: string;
    status: Enums<"trip_participant_status">;
    role: Database["permissions"]["Enums"]["user_role"];
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
            id,name,description,type,start_date,end_date,currency_iso_code,status,created_at, created_by, group_id, last_modified_at,last_modified_by, text_document_id, location, slug
            )`,
        )
        .order("name", { ascending: true });
    return response;
}

async function fetchTripDetails({
    tripId,
    tripSlug,
}: {
    tripId?: string;
    tripSlug?: string;
}) {
    const supabase = await createClient();
    if (tripId) {
        return await supabase
            .from("v_trip_details")
            .select("*")
            .eq("id", tripId)
            .single()
            .overrideTypes<{
                participants: [ParticipantResponseJson];
                // text_document: TripTextDocument;
            }>();
    } else {
        return await supabase
            .from("v_trip_details")
            .select("*")
            .eq("slug", tripSlug || "")
            .single()
            .overrideTypes<{
                participants: [ParticipantResponseJson];
                // text_document: TripTextDocument;
            }>();
    }
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

async function fetchTripTransactions(
    tripId: string,
    limit: number = 10,
    offset: number = 0,
    orderBy: {
        field: keyof Tables<"trip_transaction">;
        ascending?: boolean;
    } = {
        field: "created_at",
        ascending: true,
    },
) {
    console.log(offset, offset + limit - 1);
    const supabase = await createClient();
    const { data, count, error } = await supabase
        .from("trip_transaction")
        .select("*", { count: "exact", head: false })
        .eq("trip_id", tripId)
        .order(orderBy.field, { ascending: orderBy?.ascending || true })
        .range(offset, offset + limit - 1);
    console.log(data, count, error);
    return { data, count, error };
}

async function upsertTripTransaction(
    transaction: TablesInsert<"trip_transaction">,
) {
    const supabase = await createClient();
    return await supabase
        .from("trip_transaction")
        .upsert(transaction, { onConflict: "id" })
        .select()
        .single();
}

async function deleteTripTransaction(transactionId: string) {
    const supabase = await createClient();
    return await supabase
        .from("trip_transaction")
        .delete()
        .eq("id", transactionId);
}

export type TripPlannedFinanceStatisticsResponse = Omit<
    Tables<"v_trip_financial_summary">,
    "financials" | "participants" | "financials_by_category"
> & {
    financials: TripFinancialsJson[];
    participants: TripFinancialsParticipantsJson[];
    financials_by_category: TripFinancialsPerCategoryJson[];
};

async function fetchPlannedFinanceStatistics(tripId: string) {
    const supabase = await createClient();
    return await supabase
        .from("v_trip_financial_summary")
        .select()
        .eq("trip_id", tripId)
        .limit(1)
        .single()
        .overrideTypes<{
            financials: TripFinancialsJson[];
            participants: TripFinancialsParticipantsJson[];
            financials_by_category: TripFinancialsPerCategoryJson[];
        }>();
}

async function fetchTripTransactionTotalAmount({
    tripId,
    unitAmount,
    calculationType,
}: {
    tripId: string;
    unitAmount: number;
    calculationType: Enums<"trip_transaction_calculation_type">;
}) {
    const supabase = await createClient();
    return await supabase.rpc("trip_transaction_calculate_total", {
        p_trip_id: tripId,
        p_unit_amount: unitAmount,
        p_calculation_type: calculationType,
    });
}

async function fetchTripAccommodationSummary(tripId: string) {
    const supabase = await createClient();
    return await supabase
        .from("v_trip_accommodation_summary")
        .select("*")
        .eq("trip_id", tripId)
        .order("check_in_date", { ascending: true })
        .order("name", { ascending: true })
        .overrideTypes<Array<TripAccommodationSummaryView>>();
}

async function upsertTripAccommodationUnit(
    accommodationUnit: TablesInsert<"accommodation_unit">,
) {
    const supabase = await createClient();
    return await supabase
        .from("accommodation_unit")
        .upsert(accommodationUnit, { onConflict: "id" })
        .select()
        .single();
}

async function deleteTripAccommodationUnit(accommodationUnitId: string) {
    const supabase = await createClient();
    return await supabase
        .from("accommodation_unit")
        .delete()
        .eq("id", accommodationUnitId);
}

async function fetchCurrentTripParticipant(tripId: string) {
    const supabase = await createClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims.sub;
    if (!userId) return { data: null, error: null };
    return await supabase
        .from("v_trip_participant_details")
        .select()
        .eq("user_id", userId)
        .eq("trip_id", tripId)
        .limit(1)
        .single();
}

async function upsertAccommodation(data: TablesInsert<"accommodation">) {
    const supabase = await createClient();
    return await supabase
        .from("accommodation")
        .upsert(data, { onConflict: "id" })
        .select()
        .limit(1)
        .single();
}

async function deleteAccommodation(accommodationId: string) {
    const supabase = await createClient();
    return await supabase
        .from("accommodation")
        .delete()
        .eq("id", accommodationId);
}

async function fetchTripParticipantDetails(
    tripId: string,
    includeStatuses: Enums<"trip_participant_status">[],
) {
    const supabase = await createClient();
    return await supabase
        .from("v_trip_participant_details")
        .select("*")
        .eq("trip_id", tripId)
        .in("status", includeStatuses)
        .order("nickname", { ascending: true })
        .order("last_name", { ascending: true });
}

async function upsertAccommodationAssignments(
    tripParticipantId: string,
    accommodationUnitId: string,
) {
    const supabase = await createClient();
    return await supabase.rpc("accommodation_unit_assignment_set", {
        p_trip_participant_id: tripParticipantId,
        p_accommodation_unit_id: accommodationUnitId,
    });
}

async function removeAccommodationAssignment(
    tripParticipantId: string,
    accommodationUnitId: string,
) {
    const supabase = await createClient();
    return await supabase
        .from("accommodation_unit_assignment")
        .delete()
        .eq("trip_participant_id", tripParticipantId)
        .eq("accommodation_unit_id", accommodationUnitId);
}

async function fetchTripTransportSummary(tripId: string) {
    const supabase = await createClient();
    return await supabase
        .from("v_trip_travel_summary")
        .select("*")
        .eq("trip_id", tripId)
        .order("estimated_departure", { ascending: true })
        .overrideTypes<
            Array<{ assignments: Tables<"v_trip_participant_details"> }>
        >();
}

async function upsertTransport(data: TablesInsert<"trip_travel">) {
    delete data["estimated_arrival"];
    delete data["name"];
    const supabase = await createClient();
    return await supabase
        .from("trip_travel")
        .upsert(data, { onConflict: "id" })
        .select("*")
        .limit(1)
        .single();
}

async function deleteTransport(transportId: string) {
    const supabase = await createClient();
    return await supabase.from("trip_travel").delete().eq("id", transportId);
}

async function upsertTravelAssignment(
    travelId: string,
    tripParticipantId: string,
) {
    const supabase = await createClient();
    return await supabase
        .from("trip_travel_assignment")
        .upsert(
            {
                trip_participant_id: tripParticipantId,
                trip_travel_id: travelId,
            },
            { onConflict: "trip_travel_id,trip_participant_id" },
        )
        .select()
        .single();
}
async function deleteTravelAssignment(
    travelId: string,
    tripParticipantId: string,
) {
    const supabase = await createClient();
    return await supabase
        .from("trip_travel_assignment")
        .delete()
        .eq("trip_travel_id", travelId)
        .eq("trip_participant_id", tripParticipantId);
}

async function fetchUnlinkedTransactions(tripId: string) {
    const supabase = await createClient();
    return await supabase
        .from("trip_transaction")
        .select("id,description,total_amount,currency_iso_code")
        .eq("trip_id", tripId)
        .is("related_record_id", null)
        .order("description", { ascending: true });
}

async function fetchTransactionById(transactionId: string) {
    const supabase = await createClient();
    return await supabase
        .from("trip_transaction")
        .select(
            "id,description,total_amount,currency_iso_code,related_record_id",
        )
        .eq("id", transactionId)
        .limit(1)
        .single();
}

async function updateLinkedTransaction({
    transactionId,
    recordId,
    recordType,
}: {
    transactionId: string | null;
    recordId: string;
    recordType: keyof Database["public"]["Tables"];
}) {
    const supabase = await createClient();
    const updateResponse = await supabase
        .from(recordType)
        .update({ trip_transaction_id: transactionId })
        .eq("id", recordId);
    if (!transactionId || updateResponse.error) return updateResponse;
    return await fetchTransactionById(transactionId);
}

export interface TripTimelineResponseRow
    extends Omit<Tables<"v_trip_timeline">, "details"> {
    details:
        | TripAccommodationSummaryView["accommodation_units"]
        | Tables<"v_trip_participant_details">;
}

async function fetchTripTimeline(
    tripId: string,
    // limit: number = 60,
    // offset: number = 0,
) {
    const supabase = await createClient();
    const { data, count, error } = await supabase
        .from("v_trip_timeline")
        .select("*", { count: "exact", head: false })
        .eq("trip_id", tripId)
        .order("start_date,end_date,type", { ascending: true })
        .overrideTypes<Array<TripTimelineResponseRow>>();
    // .range(offset, offset + limit - 1);
    return { data, count, error };
}

async function deleteTrips(tripIds: string[]) {
    const supabase = await createClient();
    return await supabase.from("trip").delete().in("id", tripIds);
}

export {
    fetchTrips,
    fetchTripDetails,
    upsertTrips,
    updateParticipant,
    inviteParticipants,
    fetchTripTransactions,
    upsertTripTransaction,
    deleteTripTransaction,
    fetchPlannedFinanceStatistics,
    fetchTripTransactionTotalAmount,
    fetchTripAccommodationSummary,
    upsertTripAccommodationUnit,
    deleteTripAccommodationUnit,
    fetchCurrentTripParticipant,
    upsertAccommodation,
    deleteAccommodation,
    fetchTripParticipantDetails,
    upsertAccommodationAssignments,
    removeAccommodationAssignment,
    fetchTripTransportSummary,
    upsertTransport,
    deleteTransport,
    upsertTravelAssignment,
    deleteTravelAssignment,
    fetchUnlinkedTransactions,
    fetchTransactionById,
    updateLinkedTransaction,
    fetchTripTimeline,
    deleteTrips,
};

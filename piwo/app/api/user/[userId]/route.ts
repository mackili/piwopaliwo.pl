import { NextRequest } from "next/server";
import { createClient, supabaseToNextResponse } from "@/utils/supabase/server";
import { UserInfo, UserInfoSchema } from "@/components/auth/types";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    const supabase = await createClient();
    const response = await supabase
        .from("users")
        .select()
        .filter("id", "eq", userId);
    return supabaseToNextResponse(response);
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;
    const userInfo = UserInfoSchema.parse({
        ...((await req.json()) as UserInfo),
        userId: userId,
    });
    const supabase = await createClient();
    const response = await supabase.from("UserInfo").update(userInfo);
    return supabaseToNextResponse(response);
}

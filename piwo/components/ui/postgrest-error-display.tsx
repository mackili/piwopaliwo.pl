import { PostgrestError } from "@supabase/supabase-js";
import ErrorMessage from "./error-message";

export default function PostgrestErrorDisplay({
    error,
}: {
    error: PostgrestError | null | undefined;
}) {
    return error ? (
        <ErrorMessage error={`${error.code}: ${error.message}`} />
    ) : (
        <></>
    );
}

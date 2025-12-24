import { PostgrestError } from "@supabase/supabase-js";
import ErrorMessage from "./error-message";

export default function PostgrestErrorDisplay({
    error,
}: {
    error:
        | {
              code?: string;
              details?: string | null;
              hint?: string | null;
              message?: string | null;
          }
        | PostgrestError
        | null
        | undefined;
}) {
    return error ? (
        <ErrorMessage error={`${error.code}: ${error.message}`} />
    ) : (
        <></>
    );
}

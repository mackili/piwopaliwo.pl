import { Badge } from "./badge";

export default function ErrorMessage({ error }: { error: string | null }) {
    return <Badge variant="destructive">{error}</Badge>;
}

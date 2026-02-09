import { Card, CardContent } from "../ui/card";
import { BLOG_IMAGE_BUCKET_NAME } from "./image-drawer-grid";
import { Plus } from "lucide-react";
import UpsertImage from "../ui/upsert-image";
export default function UploadImageItem({
    textDocumentFolderPath,
    onSuccess,
}: {
    textDocumentFolderPath: string;
    onSuccess?: () => void;
}) {
    return (
        <Card className="aspect-square p-0 gap-2 relative group">
            <CardContent className="p-0 w-full h-full rounded-xl flex items-center justify-center">
                <Plus />
            </CardContent>
            <UpsertImage
                bucketName={BLOG_IMAGE_BUCKET_NAME}
                folderPath={textDocumentFolderPath}
                className="w-full h-full rounded-xl aspect-square"
                onSuccess={onSuccess}
                maxSize={5000000}
            />
        </Card>
    );
}

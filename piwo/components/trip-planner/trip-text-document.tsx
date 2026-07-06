"use client";
import { Button } from "../ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";
// import TextDocumentRender from "./trip-text-document-render";

export default function TripSuperDetail({
    children,
    title,
}: {
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="default">Read trip memo</Button>
            </DrawerTrigger>
            <DrawerContent>
                <>
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                    </DrawerHeader>
                    <div className="overflow-y-scroll m-4 lg:mx-16">
                        {children}
                    </div>
                </>
            </DrawerContent>
        </Drawer>
    );
}

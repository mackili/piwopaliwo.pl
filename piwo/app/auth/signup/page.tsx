import SignUpPage from "@/components/auth/signupForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <div className="flex h-screen justify-center-safe items-center-safe">
            <div className="md:w-100 flex gap-4 flex-col">
                <SignUpPage />
                <h4 className="text-center scale-80">OR</h4>
                <Link href="/auth/login" className="flex justify-center-safe">
                    <Button className="w-full" variant="secondary">
                        Log In
                    </Button>
                </Link>
            </div>
        </div>
    );
}

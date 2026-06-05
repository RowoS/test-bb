import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default function AuthButtons() {

    const buttonAttributes = "bg-secondary-green text-black font-semibold hover:bg-accent-green hover:text-accent-white";

    return (
        <div className="flex flex-col gap-4 font-montserrat text-xl">
            <Button asChild size={"lg"} variant={"default"} className={buttonAttributes}>
                <Link href="/login">Sign into your Account</Link>
            </Button>

            <Button asChild size={"lg"} variant={"default"} className={buttonAttributes}>
                <Link href="/create-account">Create Account</Link>
            </Button>
        
        </div>
    );

}
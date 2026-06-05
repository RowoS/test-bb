// hooks/useSuccess.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function useSuccess() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleOrderNow = async () => {
        setIsLoading(true);
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();

        console.log("User data:", user);
        if (!user) {
            router.push("/login");
            return;
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role === "vendor") {
            router.push("/vendor/dashboard");
        } else {
            router.push("/customer");
        }

        setIsLoading(false);
    };

    return {
        values: { isLoading },
        functions: { handleOrderNow },
    };
}
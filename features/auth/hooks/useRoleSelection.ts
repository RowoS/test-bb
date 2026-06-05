'use client';

import { updateRole } from "../lib/auth-actions";
import { useAsyncForm } from "@/features/shared/hooks/useAsyncForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useRoleSelection() {
    const { isLoading, error, success, setError, setSuccess, run } = useAsyncForm();
    const [role, setRole] = useState<"customer" | "vendor" | "">("");
    const router = useRouter();

    const submit = async () => {
        if(!role){
            setError("Please select a role");
            return;
        }

        if(role !== "customer" && role !== "vendor"){
            setError("Invalid role selected");
            return;
        }

        await run(async () => {
            const { error } = await updateRole(role);
            if (error) throw error;

            setSuccess("Role updated successfully");
            router.refresh();
            router.push("/signup-success");
        })
        
    }

    return {
        values: { role },
        setters: { setRole },
        isLoading,
        error,
        success,
        submit,
    }
}

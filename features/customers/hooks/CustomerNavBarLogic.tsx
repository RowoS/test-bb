"use client";

import { useRouter } from "next/navigation";
import { LogOutUser } from "@/features/shared/libs/shared-actions"
import { useAsyncForm } from "@/features/shared/hooks/useAsyncForm";
import { useState } from "react";

export function useCustomerNavBar() {
    const router = useRouter();
    const { run, isLoading } = useAsyncForm();
    const [openProfile, setOpenProfile] = useState(false);

    const goToProfile = () => {
        setOpenProfile(true);
    };

    const handleLogout = async () => {
        await run(async () => {
            await LogOutUser();
            router.push("/login");
            router.refresh();
        });
    };

    return {
        goToProfile,
        handleLogout,
        openProfile,
        setOpenProfile,
        isLoading,
    }

}
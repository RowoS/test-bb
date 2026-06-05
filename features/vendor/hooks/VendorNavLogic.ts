"use client";

import { useRouter } from "next/navigation";
import { LogOutUser } from "@/features/shared/libs/shared-actions"
import { useAsyncForm } from "@/features/shared/hooks/useAsyncForm";
import { useState } from "react";

export function useVendorNavBar() {
    const router = useRouter();
    const { run, isLoading } = useAsyncForm();
    const [openRestaurantProfile, setOpenRestaurantProfile] = useState(false);

    const goToRestaurantProfile = () => {
        setOpenRestaurantProfile(true);
    };

    const handleLogout = async () => {
        await run(async () => {
            await LogOutUser();
            router.push("/login");
            router.refresh();
        });
    };

    return {
        goToRestaurantProfile,
        handleLogout,
        openRestaurantProfile,
        setOpenRestaurantProfile,
        isLoading,
    }

}
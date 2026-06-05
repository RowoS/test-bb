"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoreReports, banStore, unbanStore, deleteStore } from "../libs/admin-actions";
import type { StoreReportDetail } from "../types/types";

export function useStoreReports(storeId: string, initialIsBanned: boolean) {
    const router = useRouter();
    const [reports, setReports] = useState<StoreReportDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [banned, setBanned] = useState(initialIsBanned);
    const [isBanModalOpen, setIsBanModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        getStoreReports(storeId)
            .then(setReports)
            .finally(() => setIsLoading(false));
    }, [storeId]);

    const handleBan = async (reason: string) => {
        await banStore(storeId, reason);
        setBanned(true);
        setIsBanModalOpen(false);
    };

    const handleUnban = async () => {
        await unbanStore(storeId);
        setBanned(false);
    };

    const handleDelete = async () => {
        await deleteStore(storeId);
        router.push("/admin/dashboard");
    };

    return {
        values: { reports, isLoading, banned, isBanModalOpen, isDeleteModalOpen },
        functions: {
            handleBan,
            handleUnban,
            handleDelete,
            setIsBanModalOpen,
            setIsDeleteModalOpen,
        },
    };
}
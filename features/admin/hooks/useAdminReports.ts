"use client";

import { useState, useEffect } from "react";
import { getStoresWithReportCounts } from "../libs/admin-actions";
import type { StoreReportSummary } from "../types/types";

export function useAdminReports() {
    const [stores, setStores] = useState<StoreReportSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getStoresWithReportCounts()
            .then(setStores)
            .finally(() => setIsLoading(false));
    }, []);

    const filtered = stores.filter((s) =>
        !search || s.store_name.toLowerCase().includes(search.toLowerCase())
    );

    return {
        values: { stores: filtered, isLoading, search },
        functions: { setSearch },
    };
}
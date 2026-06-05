"use client";

import { useState, useEffect, useCallback } from "react";
import { getBarangays, getRandomStores, getStoresInBarangay, searchStoresByName } from "../libs/search-actions";
import { Barangay, StoreResult, barangayCache } from "../types/types";

export function useSearch() {
    const [searchMode, setSearchMode] = useState<"barangay" | "text">("barangay");
    const [barangays, setBarangays] = useState<Barangay[]>([]);
    const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(null);
    const [stores, setStores] = useState<StoreResult[]>([]);
    const [textQuery, setTextQuery] = useState("");
    const [isLoadingBarangays, setIsLoadingBarangays] = useState(false);
    const [isLoadingStores, setIsLoadingStores] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Shared store loader
    const loadStores = useCallback(async (fetcher: () => Promise<StoreResult[]>) => {
        setStores([]);
        setIsLoadingStores(true);
        setError(null);
        try {
            const results = await fetcher();
            setStores(results);
        } catch {
            setError("Failed to load stores");
        } finally {
            setIsLoadingStores(false);
        }
    }, []);

    const loadRandomStores = useCallback(() => {
        loadStores(getRandomStores);
    }, [loadStores]);

    useEffect(() => {
        if (barangayCache.data) {
            setBarangays(barangayCache.data);
            return;
        }
        setIsLoadingBarangays(true);
        getBarangays()
            .then((data) => {
                barangayCache.data = data;
                setBarangays(data);
            })
            .catch(() => setError("Failed to load barangays"))
            .finally(() => setIsLoadingBarangays(false));
    }, []);

    useEffect(() => {
        loadRandomStores();
    }, []);

    const handleSelectBarangay = (barangay: Barangay) => {
        setSelectedBarangay(barangay);
        loadStores(() => getStoresInBarangay(barangay.id));
    };

    const handleTextSearch = () => {
        if (!textQuery.trim()) return;
        loadStores(() => searchStoresByName(textQuery.trim()));
    };

    const handleClearSelection = () => {
        setSelectedBarangay(null);
        setTextQuery("");
        loadRandomStores();
    };

    const handleModeSwitch = (mode: "barangay" | "text") => {
        setSearchMode(mode);
        handleClearSelection();
    };

    return {
        values: { searchMode, textQuery, barangays, selectedBarangay, stores, isLoadingBarangays, isLoadingStores, error },
        functions: { handleSelectBarangay, handleClearSelection, handleTextSearch, handleModeSwitch, setTextQuery },
    };
}
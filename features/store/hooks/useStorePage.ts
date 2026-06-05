"use client";

import { useState, useEffect } from "react";
import { getStoreInfo, getStoreMenu } from "../libs/store-actions";
import {submitStoreReport} from "../libs/report-actions"; 
import { MenuCategory, ReportReason } from "../types/types";
import { useCart } from "./useCart";
import { StoreInfo } from "@/features/profiles/types/types";

export function useStorePage(storeId: string) {
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [submittingReport, setSubmitReport] = useState(false);
    const [activeTab, setActiveTab] = useState("All");
    const cart = useCart(storeId);

    useEffect(() => {
        if (!storeId) return;
        setIsLoading(true);
        getStoreMenu(storeId)
            .then(setCategories)
            .catch(() => console.error("Failed to load menu"))
            .finally(() => setIsLoading(false));
        
        getStoreInfo(storeId)
            .then((data) => setStoreInfo(data))
            .catch(() => console.error("Failed to load store information"));
    }, [storeId]);

    const submitReport = async (reason: ReportReason, notes: string) => {
        if (!storeId) throw new Error("Store ID is required");
        if (!reason) return;

        setSubmitReport(true);
        try {
            await submitStoreReport({ storeId, reason, notes });
        } catch (error) {
            console.error("Failed to submit report", error);
        } finally {
            setSubmitReport(false);
        }
    };

    const tabs = ["All", ...categories.map(c => c.name)];

    const visibleCategories = categories
        .map(cat => ({
            ...cat,
            items: (cat.items ?? []).filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }))
        .filter(cat => activeTab === "All" || cat.name === activeTab);

    return {
        categories: visibleCategories,
        storeInfo: {name: storeInfo?.store_name, storeId: storeInfo?.id, logo: storeInfo?.store_logo, description: storeInfo?.store_description, rating: storeInfo?.average_rating, },
        isLoading,
        searchQuery,
        activeTab,
        tabs,
        submittingReport,
        cart,
        setSearchQuery,
        setActiveTab,
        submitReport,
        setSubmitReport,
    };
}
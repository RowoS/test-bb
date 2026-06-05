"use client";

import { useState } from "react";
import { MenuLogic } from "./MenuLogic";
import { useProfile } from "@/features/profiles/hooks/ProfileLogic";
import { MenuItem } from "../types/types";

export function useCatalogPage() {
    const { values } = useProfile();
    const storeId = values.storeInfo?.id ?? "";
    const menu = MenuLogic(storeId);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editFields, setEditFields] = useState<{ name: string; description: string; price: string; image: string }>({ name: "", description: "", price: "", image: "" });
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    const filteredCategories = menu.values.categories.map(cat => ({
        ...cat,
        items: (cat.items ?? []).filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }));

    const handleStartEdit = (item: MenuItem) => {
        setEditingItemId(item.id);
        setEditFields({
            name: item.name,
            description: item.description ?? "",
            price: String(item.price),
            image: item.image ?? "",
        });
    };

    const handleSaveEdit = async (newCategoryId: string, itemId: string) => {
        const originalCategoryId = menu.values.categories
            .find(c => c.items?.some(i => i.id === itemId))?.id ?? "";

        await menu.functions.handleUpdateItem(originalCategoryId, itemId, {
            name: editFields.name,
            description: editFields.description || undefined,
            price: Number(editFields.price),
            image: editFields.image || undefined,
            category_id: newCategoryId, // ✅ pass new category
        });
        setEditingItemId(null);
    };

    const tabs = ["All", ...menu.values.categories.map(c => c.name)];

    const visibleCategories = activeTab === "All"
        ? filteredCategories
        : filteredCategories.filter(c => c.name === activeTab);

    return {
        data: { storeId, isModalOpen, isCategoryModalOpen, searchQuery, activeTab, tabs, editingItemId, editFields },
        Menufunctions: { setSearchQuery, setActiveTab, setModalOpen, setCategoryModalOpen, setEditingItemId, setEditFields, handleSaveEdit, handleStartEdit },
        categories: visibleCategories,
        ...menu
    };
}
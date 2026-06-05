    import { useState, useEffect } from "react";
    import {
        getStoreMenu, addMenuCategory, addMenuItem,
        updateMenuItem, deleteMenuItem, deleteMenuCategory,
        addMenuItemVariant, deleteMenuItemVariant, toggleItemAvailability
    } from "../libs/menu-actions";
    import { MenuCategory } from "../types/types"; 
    import { useAsyncForm } from "@/features/shared/hooks/useAsyncForm";

    export function MenuLogic(storeId: string){
        const [categories, setCategories] = useState<MenuCategory[]>([]);
        const { isLoading, error, success, setSuccess, run } = useAsyncForm();

        useEffect(() => {
            if (!storeId) return;
            getStoreMenu(storeId)
                .then(setCategories)
                .catch(() => console.error("Failed to load menu"));
        }, [storeId]);

        const handleAddCategory = async (name: string) => {
            await run(async () => {
                const newCat = await addMenuCategory(storeId, name, categories.length);
                setCategories(prev => [...prev, { ...newCat, items: [] }]);
                setSuccess("Category added");
            });
        };

        const handleAddItem = async (categoryId: string, item: {
            name: string;
            description?: string;
            price: number;
            image?: string;
        }) => {
            await run(async () => {
                const newItem = await addMenuItem({ store_id: storeId, category_id: categoryId, ...item });
                    setCategories(prev => prev.map(cat =>
                        cat.id === categoryId
                            ? { ...cat, items: [...(cat.items ?? []), { ...newItem, variants: [], is_available: newItem.is_available ?? true }] }
                            : cat
                    ));

                setSuccess("Item added");
            });
        };

        const handleUpdateItem = async (categoryId: string, itemId: string, updates: {
            name?: string;
            description?: string;
            price?: number;
            image?: string;
            is_available?: boolean;
            category_id?: string;
        }) => {
            await run(async () => {
                const updated = await updateMenuItem(itemId, updates);
                const newCategoryId = updates.category_id;

                if (newCategoryId && newCategoryId !== categoryId) {
                    setCategories(prev => {
                        const item = prev
                            .find(c => c.id === categoryId)
                            ?.items?.find(i => i.id === itemId);
                        if (!item) return prev;
                        return prev.map(cat => {
                            if (cat.id === categoryId)
                                return { ...cat, items: (cat.items ?? []).filter(i => i.id !== itemId) };
                            if (cat.id === newCategoryId)
                                return { ...cat, items: [...(cat.items ?? []), { ...item, ...updated }] };
                            return cat;
                        });
                    });
                } else {
                    setCategories(prev => prev.map(cat =>
                        cat.id === categoryId
                            ? { ...cat, items: (cat.items ?? []).map(i => i.id === itemId ? { ...i, ...updated } : i) }
                            : cat
                    ));
                }
            });
        };

        const handleDeleteItem = async (categoryId: string, itemId: string) => {
            await run(async () => {
                await deleteMenuItem(itemId);
                setCategories(prev => prev.map(cat =>
                    cat.id === categoryId
                        ? { ...cat, items: (cat.items ?? []).filter(i => i.id !== itemId) }
                        : cat
                ));
            });
        };

        const handleDeleteCategory = async (categoryId: string) => {
            await run(async () => {
                await deleteMenuCategory(categoryId);
                setCategories(prev => prev.filter(cat => cat.id !== categoryId));
            });
        };

        const handleToggleAvailability = async (categoryId: string, itemId: string, isAvailable: boolean) => {
            await run(async () => {
                await toggleItemAvailability(itemId, isAvailable);
                setCategories(prev => prev.map(cat =>
                    cat.id === categoryId
                        ? { ...cat, items: (cat.items ?? []).map(i => i.id === itemId ? { ...i, is_available: isAvailable } : i) }
                        : cat
                ));
            });
        };

        const handleAddVariant = async (categoryId: string, itemId: string, variant: {
            name: string;
            option: string;
            price_modifier: number;
        }) => {
            await run(async () => {
                const newVariant = await addMenuItemVariant({ item_id: itemId, ...variant });
                setCategories(prev => prev.map(cat =>
                    cat.id === categoryId
                        ? {
                            ...cat, items: (cat.items ?? []).map(i =>
                                i.id === itemId
                                    ? { ...i, variants: [...(i.variants ?? []), newVariant] }
                                    : i
                            )
                        }
                        : cat
                ));
            });
        };

        return {
            values: {categories, isLoading, error, success},
            functions: {
                handleAddCategory, handleAddItem, handleUpdateItem, handleDeleteItem,
                handleDeleteCategory, handleToggleAvailability, handleAddVariant
            }
        };
    }
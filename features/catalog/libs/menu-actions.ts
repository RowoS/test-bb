
'use client';
import { createClient } from "@/lib/supabase/client";
import { MenuCategory } from "../types/types";


export async function getStoreMenu(storeId: string): Promise<MenuCategory[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .rpc("get_store_menu", { p_store_id: storeId });

    if (error) throw error;
    return data ?? [];
}

export async function addMenuItem(item: {
    store_id: string;
    category_id: string;
    name: string;
    description?: string;
    is_available?: boolean;
    price: number;
    image?: string;
}) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("menu_items")
        .insert(item)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function addMenuCategory(storeId: string, name: string, displayOrder?: number) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("menu_categories")
        .insert({ store_id: storeId, name, display_order: displayOrder ?? 0 })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateMenuItem(itemId: string, updates: {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    is_available?: boolean;
    category_id?: string;
    display_order?: number;
}) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("menu_items")
        .update(updates)
        .eq("id", itemId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteMenuItem(itemId: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", itemId);

    if (error) throw error;
}

export async function deleteMenuCategory(categoryId: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("menu_categories")
        .delete()
        .eq("id", categoryId);

    if (error) throw error;
}

export async function addMenuItemVariant(variant: {
    item_id: string;
    name: string;
    option: string;
    price_modifier: number;
}) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("menu_item_variants")
        .insert(variant)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deleteMenuItemVariant(variantId: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from("menu_item_variants")
        .delete()
        .eq("id", variantId);

    if (error) throw error;
}

export async function toggleItemAvailability(itemId: string, isAvailable: boolean) {
    const supabase = createClient();
    const { error } = await supabase
        .from("menu_items")
        .update({ is_available: isAvailable })
        .eq("id", itemId);

    if (error) throw error;
}
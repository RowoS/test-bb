"use client";
import { createClient } from "@/lib/supabase/client";
import { MenuCategory, StoreReviewsMeta } from "../types/types";
import { StoreInfo, } from "@/features/profiles/types/types";

export async function getStoreMenu(storeId: string): Promise<MenuCategory[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .rpc("get_store_menu", { p_store_id: storeId });

    if (error) throw error;
    return data ?? [];
}

export async function getStoreInfo(storeId: string) {
    const supabase = await createClient();


    if (!storeId) throw new Error("User not authenticated");
   
    const response = await supabase.rpc('get_store_info', { store_id: storeId }).single<StoreInfo>();

    console.log("getStoreInfo response:", response);

    if (response.error || !response.data) {
        throw new Error("Store not found");
    }

    return {
        ...response.data,
    };
}

export async function getStoreReviews(storeId: string): Promise<StoreReviewsMeta> {
    const supabase = createClient();

    let resolvedId = storeId;

    if (!resolvedId) {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw new Error(`Auth error: ${authError.message}`);
        resolvedId = user!.id;
    }

    const { data, error } = await supabase.rpc("get_store_reviews_with_meta", {
        p_store_id: resolvedId,
    });

    if (error) throw new Error(error.message);
    return data ?? null;
}

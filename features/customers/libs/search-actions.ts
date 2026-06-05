import { createClient } from "@/lib/supabase/client";
import { Barangay, StoreResult } from "../types/types";

export async function getBarangays(): Promise<Barangay[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .rpc("get_barangays");

    if (error) throw error;
    return data;
}

export async function getStoresInBarangay(barangayId: string): Promise<StoreResult[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .rpc("get_stores_with_barangay")
        .eq("barangay_id", barangayId);

    if (error) throw error;
    return data;
}

export async function searchStoresByName(query: string): Promise<StoreResult[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .rpc('search_stores_with_details', { search_query: query });

    if (error) {
        console.error("Search error:", error);
        throw error;
    }

    return (data || []).map((store: StoreResult) => ({
        ...store,
        average_rating: store.average_rating ? Number(store.average_rating) : null,
    })) as StoreResult[];
}

export async function getRandomStores(): Promise<StoreResult[]> {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_random_stores", { limit_count: 12 });
    if (error) throw error;
    return (data || []).map((store: StoreResult) => ({
        ...store,
        average_rating: store.average_rating ? Number(store.average_rating) : null,
    }));
}
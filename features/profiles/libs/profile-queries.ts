"use server";
import { getStoreProfile } from "@/features/shared/libs/route/route";
import { createClient } from "@/lib/supabase/server";
import { StoreInfo } from "../types/types";



export async function getStoreInfo() {
    const supabase = await createClient();
    const { userId } = await getStoreProfile();

    if (!userId) throw new Error("User not authenticated");
   
    const response = await supabase.rpc('get_store_info', { store_id: userId }).single<StoreInfo>();

    if (response.error) {
        throw new Error(response.error.message);
    }

    return {
        ...response.data,
    };
}
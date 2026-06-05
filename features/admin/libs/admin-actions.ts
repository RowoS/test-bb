"use server";

import { createClient } from "@/lib/supabase/server";
import type { StoreReportSummary, StoreReportDetail } from "../types/types";

export async function getStoresWithReportCounts(): Promise<StoreReportSummary[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_stores_with_report_counts");
    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function getStoreReports(storeId: string): Promise<StoreReportDetail[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_store_reports", { p_store_id: storeId });
    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function banStore(storeId: string, reason: string) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("ban_store", { 
        p_store_id: storeId, 
        p_reason: reason 
    });
    if (error) throw new Error(error.message);
}

export async function unbanStore(storeId: string) {
    const supabase = await createClient();
    const { error } = await supabase.rpc("unban_store", { 
        p_store_id: storeId 
    });
    if (error) throw new Error(error.message);
}

export async function deleteStore(storeId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("stores")
        .delete()
        .eq("id", storeId);
    if (error) throw new Error(error.message);
}
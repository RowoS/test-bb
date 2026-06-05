"use server";

import { createClient } from "@/lib/supabase/server";
import {Report} from "../types/types";

export async function submitStoreReport({storeId,reason,notes}: Report) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase.from("store_reports").insert({
        store_id: storeId,
        customer_id: user.id,
        reason,
        notes: notes || null,
    });

    if (error) throw new Error(error.message);
}
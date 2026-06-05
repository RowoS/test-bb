"use client";
import { createClient } from "@/lib/supabase/client";


export async function createStore(payload: {
    id: string;
    store_name: string;
    store_description: string | null;
    store_logo: string | null;
    store_coordinates: string | null;
    phone_numbers: string[];
    address: string;
    opening_time: string | null;
    closing_time: string | null;
    delivery_options: string;
}) {
    const supabase = createClient();

    const { error } = await supabase.from('stores').insert(payload);

    if (error) {
        throw error;
    }
}
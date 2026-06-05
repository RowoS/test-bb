'use client';

import { createClient } from "@/lib/supabase/client";
import { Address, Barangay, NewAddress } from "../types/types";


export async function getAddresses(): Promise<Address[]> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Not authenticated");

    const { data, error } = await supabase.rpc("get_customer_addresses");

    if (error) throw new Error(`Failed to fetch addresses: ${error.message}`);
    return data ?? [];
}

export async function insertAddress(newAddress: NewAddress): Promise<Address> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Not authenticated");

    const { data, error } = await supabase
        .from("addresses")
        .insert({
            customer_id: user.id,
            landmark: newAddress.landmark,
            barangay: newAddress.barangay,
            city: "Baybay",
            coordinates: `SRID=4326;POINT(${newAddress.longitude} ${newAddress.latitude})`,
        })
        .select()
        .single();

    if (error) throw new Error(`Failed to insert address: ${error.message}`);
    return data;
}

export async function deleteAddress(addressId: string): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", addressId);

    if (error) throw new Error(`Failed to delete address: ${error.message}`);
}

export async function getBarangays(): Promise<Barangay[]> {
    const supabase = createClient();

    const { data, error } = await supabase.rpc("get_barangays");

    if (error) throw new Error(`Failed to fetch barangays: ${error.message}`);
    return data ?? [];
}

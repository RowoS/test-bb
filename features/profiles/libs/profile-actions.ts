"use client";

import { getStoreProfile } from "@/features/shared/libs/route/route";
import { createClient } from "@/lib/supabase/client";
import { StoreInfo } from '../types/types';

export async function UpdateUserPassword(newPassword: string) {
    const supabase = createClient();
    return supabase.auth.updateUser({ password: newPassword });
}

export async function Enroll2FA() {
    const supabase = createClient();

    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Authenticator App",
    });

    if (error || !data) throw error;

    return {
        qrCodeUrl: data.totp.qr_code,
        secret: data.totp.secret,      
        factorId: data.id,           
    };
}

export async function Verify2FA(factorId: string, userInputtedCode: string) {
    const supabase = createClient();

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });

    if (challengeError || !challenge) throw challengeError;

    const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: userInputtedCode,
    });

    if (verifyError) throw verifyError;
}


export async function updateStoreInfo(updatedInfo: {
    id: string;
    store_name?: string;
    store_description?: string;
    store_logo?: string | null;
    address?: string;
    phone_numbers?: string[];
    connected_accounts?: string[];
    latitude?: number;
    longitude?: number;
    closing_time?: string,
    opening_time?: string,
    delivery_options?: "Pick-up" | "Food-Delivery" | "both";
}) {
    const supabase = createClient();

    console.log("Updating store info with:", updatedInfo);

    if (!updatedInfo.id) {
        throw new Error("Store ID is required");
    }

    const { id, latitude, longitude, ...rest } = updatedInfo;

    const payload = {
        id, // Include id for upsert
        ...rest,
        ...(latitude !== undefined && longitude !== undefined && {
            store_coordinates: `SRID=4326;POINT(${longitude} ${latitude})`
        })
    };

    console.log("Upserting store with id:", id);
    console.log("Payload for upsert:", payload);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    // Use upsert to either update existing or insert new
    const { data, error } = await supabase
        .from('stores')
        .upsert(payload, {
            onConflict: 'id', // Specify the conflict column
            ignoreDuplicates: false // Update on conflict
        })
        .select()
        .single();

    if (error) {
        console.error('Error upserting store info:', error.message, error.details, error.hint, error.code);
        throw error;
    }

    return { data };
}

export async function resetUnverifiedMFA() {
    const supabase = createClient();
    
    const { data } = await supabase.auth.mfa.listFactors();
    const unverified = data?.totp?.find(f => f.status !== "verified");
    
    if (!unverified) return null;
    
    await supabase.auth.mfa.unenroll({ factorId: unverified.id });
    
    const { data: newFactor, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Authenticator App",
    });
    
    if (error || !newFactor) return null;
    
    return {
        qrCodeUrl: newFactor.totp.qr_code,
        factorId: newFactor.id,
    };
}

export async function getMFAStatus() {
    const supabase = createClient();
    const { data } = await supabase.auth.mfa.listFactors();
    const verified = data?.totp?.find(f => f.status === "verified");
    return {
        isEnabled: !!verified,
        factorId: verified?.id ?? null,
    };
}

export async function disableMFA(factorId: string) {
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    if (error) throw error;
}

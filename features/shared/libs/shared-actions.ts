"use client";
import { createClient } from "@/lib/supabase/client";

export async function LogOutUser () {
    const supabase = createClient();
    return supabase.auth.signOut();
}

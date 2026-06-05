"use server"

import { createClient } from "@/lib/supabase/server";


export async function getStoreProfile() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  console.log('👤 user:', user?.id ?? 'NO USER')
  if (!user) return { userId: null, hasStore: false };

  const { data } = await supabase
    .from("stores")
    .select("id")
    .eq("id", user.id)
    .single();

  console.log('👤 user:', data?.id ?? 'NO USER')

  return {
    userId: user.id,
    hasStore: !!data,
  };
}
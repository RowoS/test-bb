// features/notifications/libs/notification-actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import type { Notification } from "../types/types";

export async function getNotifications(): Promise<Notification[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

    return data ?? [];
}

export async function markAsRead(notificationId: string) {
    const supabase = await createClient();
    await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
}

export async function markAllAsRead() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
}
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getNotifications, markAsRead, markAllAsRead } from "../libs/notification-actions";
import type { Notification } from "../types/types";

export function useNotifications() {
    const supabase = useRef(createClient()).current;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetch = useCallback(async () => {
        getNotifications().then(setNotifications).finally(() => setIsLoading(false));
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    useEffect(() => {
        const channel = supabase
            .channel("notifications")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "notifications" },
                (payload) => {
                    setNotifications((prev) => [payload.new as Notification, ...prev]);
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        setNotifications((prev) =>
            prev.map((n) => n.id === id ? { ...n, is_read: true } : n)
        );
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return {
        values: { notifications, isOpen, isLoading, unreadCount },
        functions: {
            setIsOpen,
            fetch,
            markAsRead: handleMarkAsRead,
            markAllAsRead: handleMarkAllAsRead,
        },
    };
}
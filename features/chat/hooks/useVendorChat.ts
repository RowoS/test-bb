"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getVendorConversations } from "../libs/chat-actions";
import type { VendorConversation } from "../types/types";

export function useVendorConversations() {
    const supabase = useRef(createClient()).current;
    const [conversations, setConversations] = useState<VendorConversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getVendorConversations()
            .then(setConversations)
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const channel = supabase
            .channel("vendor_conversations")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                () => {
                    getVendorConversations().then(setConversations);
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const filtered = conversations.filter((c) =>
        !search || c.username.toLowerCase().includes(search.toLowerCase())
    );

    return {
        values: { conversations: filtered, isLoading, search },
        functions: { setSearch },
    };
}
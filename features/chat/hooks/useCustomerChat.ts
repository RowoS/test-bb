"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCustomerConversations } from "../libs/chat-actions";
import type { CustomerConversation } from "../types/types";

export function useCustomerConversations() {
    // pretty much just loads the chat list for all store-customer conversations of the users
    const supabase = useRef(createClient()).current;
    const [conversations, setConversations] = useState<CustomerConversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getCustomerConversations()
            .then(setConversations)
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const channel = supabase
            .channel("customer_conversations")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "messages" },
                () => { getCustomerConversations().then(setConversations); }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const filtered = conversations.filter((c) =>
        !search || c.store_name.toLowerCase().includes(search.toLowerCase())
    );

    return {
        values: { conversations: filtered, isLoading, search },
        functions: { setSearch },
    };
}
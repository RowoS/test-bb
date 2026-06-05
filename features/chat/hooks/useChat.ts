"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getMessages, sendMessage } from "../libs/chat-actions";
import type { Message } from "../types/types";

export function useChat(conversationId: string) {
    const supabase = useRef(createClient()).current;
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const isAtBottom = useRef(true);

    useEffect(() => {
        getMessages(conversationId).then(({ messages, nextCursor }) => {
            setMessages(messages);
            setCursor(nextCursor);
            setHasMore(!!nextCursor);
            setIsLoading(false);
        });
    }, [conversationId]);

    const loadMore = useCallback(async () => {
        if (!hasMore || isLoadingMore || !cursor) return;

        setIsLoadingMore(true);
        const scrollEl = containerRef.current;
        const prevHeight = scrollEl?.scrollHeight ?? 0;

        const { messages: older, nextCursor } = await getMessages(conversationId, cursor);

        setMessages((prev) => [...older, ...prev]);
        setCursor(nextCursor);
        setHasMore(!!nextCursor);
        setIsLoadingMore(false);

        requestAnimationFrame(() => {
            if (scrollEl) {
                scrollEl.scrollTop = scrollEl.scrollHeight - prevHeight;
            }
        });
    }, [conversationId, cursor, hasMore, isLoadingMore]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
            isAtBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
            if (el.scrollTop < 50) loadMore();
        };

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [loadMore]);

    useEffect(() => {
        const channel = supabase
            .channel(`messages:${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const incoming = payload.new as Message;
                    setMessages((prev) => {
                        if (prev.some((m) => m.id === incoming.id)) return prev;
                        return [...prev, incoming];
                    });
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [conversationId]);

    useEffect(() => {
        if (isAtBottom.current) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const send = useCallback(async (content: string) => {
        if (!content.trim() || isSending) return;

        setIsSending(true);
        try {
            await sendMessage(conversationId, content);
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    }, [conversationId, isSending]);

    return { 
        messages, 
        isLoading, 
        isSending, 
        isLoadingMore,
        hasMore,
        send, 
        loadMore,
        containerRef, 
        bottomRef 
    };
}
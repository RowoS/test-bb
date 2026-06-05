"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { VendorConversation, CustomerConversation} from "../types/types";

export async function getOrCreateConversation(storeId: string) {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User must be logged in to start a conversation");

    const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("customer_id", user.id)
        .eq("store_id", storeId)
        .maybeSingle();

    if (existing) return { conversationId: existing.id, userId: user.id };

    const { data, error } = await supabase
        .from("conversations")
        .insert({ customer_id: user.id, store_id: storeId })
        .select("id")
        .single();

    if (error) throw new Error(`Failed to create conversation: ${error.message}`);

    if (!data?.id) throw new Error("Failed to create conversation: No ID returned");

    return { conversationId: data.id, userId: user.id };
}

export async function getMessages(conversationId: string, cursor?: string) {
    if (!conversationId) return { messages: [], nextCursor: null };
    
    const supabase = await createClient();

    let query = supabase
        .from("messages")
        .select("*, profiles(username, avatar_url)")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: false })
        .limit(30);

    if (cursor) {
        query = query.lt("created_at", cursor);
    }

    const { data } = await query;
    const messages = (data ?? []).reverse();

    return {
        messages,
        nextCursor: messages.length === 30 ? messages[0].created_at : null,
    };
}

export async function getStoreName(storeId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("stores")
        .select("store_name")
        .eq("id", storeId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching store name:", error);
        return "Unknown Store";
    }

    return data?.store_name;
}

export async function getVendorConversations(): Promise<VendorConversation[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase.rpc("get_vendor_conversations", {
        p_store_id: user.id,
    });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function sendMessage(conversationId: string, content: string) {
    // Add validation
    if (!conversationId) {
        console.error("sendMessage called with invalid conversationId:", conversationId);
        throw new Error("Invalid conversation ID");
    }
    
    if (!content || !content.trim()) {
        throw new Error("Message content cannot be empty");
    }
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("User must be logged in to send messages");

    const { error } = await supabase
        .from("messages")
        .insert({ 
            conversation_id: conversationId, 
            sender_id: user.id, 
            content: content.trim() 
        });

    if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(error.message);
    }
    
    revalidatePath(`/customer/store/${conversationId}/chat`);
}

export async function getCustomerConversations(): Promise<CustomerConversation[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase.rpc("get_customer_conversations", {
        p_customer_id: user.id,
    });

    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function timeAgo(dateStr: string | null) {
    if (!dateStr) return "";
        const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) 
        return "just now";
     if (diff < 3600) 
        return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) 
        return `${Math.floor(diff / 3600)}h ago`;
    
    return new Date(dateStr).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}
    
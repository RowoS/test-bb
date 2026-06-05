export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    profiles?: {
        username: string;
        avatar_url: string;
    };
}

export interface Conversation {
    id: string;
    customer_id: string;
    store_id: string;
    created_at: string;
    updated_at: string;
}

export type ChatMessagesProps = {
    messages: Message[];
    currentUserId: string;
    isLoadingMore?: boolean;
    bottomRef: React.RefObject<HTMLDivElement | null>;
};

export interface ChatInputProps {
    onSend: (message: string) => Promise<void>;
    isSending: boolean;
}

export interface ChatWindowProps {
    conversationId: string;
    currentUserId: string;
    storeName?: string;
    backUrl?: string;
}

export type VendorConversation = {
    conversation_id: string;
    customer_id: string;
    username: string;
    avatar_url: string | null;
    last_message: string | null;
    last_message_at: string | null;
};

export type CustomerConversation = {
    conversation_id: string;
    store_id: string;
    store_name: string;
    store_logo: string | null;
    last_message: string | null;
    last_message_at: string | null;
};
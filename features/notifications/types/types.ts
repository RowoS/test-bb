export type Notification = {
    id: string;
    user_id: string;
    title: string;
    body: string;
    url: string | null;
    type: "message" | "order" | "order_status";
    is_read: boolean;
    created_at: string;
};
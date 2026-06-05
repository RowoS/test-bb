'use client';

import { createClient } from "@/lib/supabase/client";
import { VendorOrder, CustomerOrder } from "../types/types";

export async function getVendorOrders(): Promise<VendorOrder[]> {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_vendor_orders");
    if (error) throw new Error(`Failed to fetch vendor orders: ${error.message}`);
    return (data ?? []).map((order: any) => ({
        ...order,
        items: typeof order.items === "string" ? JSON.parse(order.items) : order.items ?? [],
    }));
}

export async function confirmOrder(orderId: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from("orders")
        .update({
            status: "confirmed",
            confirmed_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    if (error) throw new Error(`Failed to confirm order: ${error.message}`);
}

export async function getCustomerOrders(): Promise<CustomerOrder[]> {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_customer_orders");
    if (error) throw new Error(`Failed to fetch customer orders: ${error.message}`);
    return (data ?? []).map((order: any) => ({
        ...order,
        items: typeof order.items === "string" ? JSON.parse(order.items) : order.items ?? [],
    }));
}

export async function cancelOrder(orderId: string, reason?: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
        .from("orders")
        .update({
            status: "cancelled",
            cancelled_at: new Date().toISOString(),
            cancel_reason: reason ?? null,
        })
        .eq("id", orderId);
    if (error) throw new Error(`Failed to cancel order: ${error.message}`);
}

export async function confirmReceived(orderId: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
        .from("orders")
        .update({
            status: "completed",
            completed_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    if (error) throw new Error(`Failed to confirm receipt of order: ${error.message}`);

    return;
}

export async function updateOrderStatus(
    orderId: string,
    status: "preparing" | "ready_for_pickup" | "out_for_delivery" | "completed"
): Promise<void> {
    const supabase = createClient();
    const updates: Record<string, any> = { status };
    if (status === "completed") updates.completed_at = new Date().toISOString();

    const { error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId);
    if (error) throw new Error(`Failed to update order status: ${error.message}`);
}

export function getNextStatuses(current: string, fulfillment: "pickup" | "delivery" ): string[] {
    if (current === "confirmed") return ["preparing"];
    if (current === "preparing") {
        return fulfillment === "pickup" ? ["ready_for_pickup"] : ["out_for_delivery"];
    }
    if (current === "ready_for_pickup" || current === "out_for_delivery") {
        return ["completed"];
    }
    return [];
}
 
export function statusLabel(status: string): string {
    const labels: Record<string, string> = {
        pending:           "Pending",
        confirmed:         "Confirmed",
        preparing:         "Preparing",
        ready_for_pickup:  "Ready for Pick-up",
        out_for_delivery:  "Out for Delivery",
        completed:         "Completed",
        cancelled:         "Cancelled",
        stand_by:          "Stand By",
    };
    return labels[status] ?? status;
}

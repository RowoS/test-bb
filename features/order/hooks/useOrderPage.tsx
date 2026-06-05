import { useState, useEffect, useCallback } from "react";
import {getVendorOrders,confirmOrder,cancelOrder,updateOrderStatus, getNextStatuses, statusLabel} from "../libs/order-actions";
import { VendorOrder } from "../types/types";
 
export type OrderTab = "request" | "running" | "history";
 
const TAB_STATUSES: Record<OrderTab, string[]> = {
    request:  ["pending"],
    running:  ["confirmed", "preparing", "ready_for_pickup", "out_for_delivery", "stand_by"],
    history:  ["completed", "cancelled"],
};

export function useVendorOrders() {
    const [allOrders, setAllOrders]     = useState<VendorOrder[]>([]);
    const [isLoading, setIsLoading]     = useState(true);
    const [error, setError]             = useState<string | null>(null);
    const [activeTab, setActiveTab]     = useState<OrderTab>("request");
    const [cancelReason, setCancelReason] = useState("");
    const [cancellingId, setCancellingId] = useState<string | null>(null);
 
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getVendorOrders();
            setAllOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    }, []);
 
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
 
    const visibleOrders = allOrders.filter(o =>
        TAB_STATUSES[activeTab].includes(o.status)
    );
 
    const counts = {
        request: allOrders.filter(o => TAB_STATUSES.request.includes(o.status)).length,
        running: allOrders.filter(o => TAB_STATUSES.running.includes(o.status)).length,
        history: allOrders.filter(o => TAB_STATUSES.history.includes(o.status)).length,
    };
 

    const patchOrder = (orderId: string, patch: Partial<VendorOrder>) => {
        setAllOrders(prev =>
            prev.map(o => o.order_id === orderId ? { ...o, ...patch } : o)
        );
    };
 
    const handleConfirm = async (orderId: string) => {
        try {
            await confirmOrder(orderId);
            patchOrder(orderId, {
                status: "confirmed",
                confirmed_at: new Date().toISOString(),
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to confirm order");
        }
    };
 
    const handleDecline = async (orderId: string) => {
        try {
            await cancelOrder(orderId, cancelReason || undefined);
            patchOrder(orderId, {
                status: "cancelled",
                cancelled_at: new Date().toISOString(),
                cancel_reason: cancelReason || null,
            });
            setCancellingId(null);
            setCancelReason("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to decline order");
        }
    };
 
    const handleStatusUpdate = async (
        orderId: string,
        status: "preparing" | "ready_for_pickup" | "out_for_delivery" | "completed"
    ) => {
        try {
            await updateOrderStatus(orderId, status);
            const patch: Partial<VendorOrder> = { status };
            if (status === "completed") patch.completed_at = new Date().toISOString();
            patchOrder(orderId, patch);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update order status");
        }
    };
 
    return {
        values: {
            visibleOrders,
            allOrders,
            isLoading,
            error,
            activeTab,
            counts,
            cancellingId,
            cancelReason,
        },
        functions: {
            setActiveTab,
            setCancellingId,
            setCancelReason,
            handleConfirm,
            handleDecline,
            handleStatusUpdate,
            refetch: fetchOrders,
            getNextStatuses,
            statusLabel,
        },
    };
}
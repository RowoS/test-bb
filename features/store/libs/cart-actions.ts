'use client';

import { createClient } from "@/lib/supabase/client";
import { MenuItem } from "../types/types";

export async function getOrCreateCart(storeId: string) {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error(`Auth error: ${authError.message}`);
    if (!user) throw new Error("Not authenticated");

    const { data: cart, error } = await supabase
        .from("carts")
        .upsert(
            { customer_id: user.id, store_id: storeId },
            { onConflict: "customer_id,store_id", ignoreDuplicates: false }
        )
        .select("id")
        .single();

    if (error) throw new Error(`Cart upsert failed: ${error.message}`);

    return cart;
}

export async function getCartItems(cartId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("cart_id", cartId);

    if (error) throw new Error(`Failed to fetch cart items: ${error.message} (${error.code})`);
    return data ?? [];
}

export async function insertCartItem(cartId: string, item: MenuItem, quantity: number = 1) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("cart_items")
        .insert({
            cart_id: cartId,
            item_id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity,
        })
        .select()
        .single();

    if (error) throw new Error(`Failed to insert cart item: ${error.message}`);
    return data;
}

export async function updateCartItemQty(cartItemId: string, qty: number) {
    const supabase = createClient();

    const { error } = await supabase
        .from("cart_items")
        .update({ quantity: qty })
        .eq("id", cartItemId);

    if (error) throw new Error(`Failed to update cart item qty: ${error.message} (${error.code})`);
}

export async function deleteCartItem(cartItemId: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);

    if (error) throw new Error(`Failed to delete cart item: ${error.message} (${error.code})`);
}

export async function clearCartItems(cartId: string) {
    const supabase = createClient();

    const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartId);

    if (error) throw new Error(`Failed to clear cart: ${error.message} (${error.code})`);
}

export async function getAllCartsForUser() {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error("Not authenticated");
 
    const { data, error: fetchError } = await supabase
        .from("carts")
        .select(`
            id,
            store_id,
            stores ( store_name ),
            cart_items (
                id,
                item_id,
                name,
                price,
                image,
                quantity
            )
        `)
        .eq("customer_id", user.id);
    

    if (fetchError) throw new Error(fetchError.message);

    return data ?? [];
}

export async function placeOrder(payload: {
    store_id: string;
    cart_id: string;
    fulfillment: "pickup" | "delivery";
    subtotal: number;
    delivery_fee: number;
    total: number;
    notes?: string;
    delivery_address_id?: string | null;
    delivery_landmark?: string | null;
    delivery_barangay?: string | null;
    delivery_city?: string | null;
    delivery_latitude?: number | null;
    delivery_longitude?: number | null;
    items : {
        item_id: string;
        name: string;
        price: number;
        quantity: number;
        image: string | null;
    }[];
}): Promise<{ order_id: string }> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Not authenticated");

    const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
        customer_id: user.id,
            store_id: payload.store_id,
            cart_id: payload.cart_id,
            status: "pending",
            fulfillment: payload.fulfillment,
            subtotal: payload.subtotal,
            delivery_fee: payload.delivery_fee,
            total: payload.total,
            notes: payload.notes ?? null,
            delivery_address_id: payload.delivery_address_id ?? null,
            delivery_landmark: payload.delivery_landmark ?? null,
            delivery_barangay: payload.delivery_barangay ?? null,
            delivery_city: payload.delivery_city ?? null,
            ...(payload.delivery_latitude != null && payload.delivery_longitude != null && {
            delivery_coordinates: `SRID=4326;POINT(${payload.delivery_longitude} ${payload.delivery_latitude})`
})
    })
    .select("id")
    .single();

    if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

    const orderItems = payload.items.map(item => ({
        order_id: order.id,
        item_id: item.item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
    }));

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) throw new Error(`Failed to insert order items: ${itemsError.message}`);

    const { error: paymentError } = await supabase
        .from("payments")
        .insert({
            order_id: order.id,
            status: "awaiting_payment",
            amount: payload.total,
        });

    if (paymentError) throw new Error(`Failed to create payment record: ${paymentError.message}`);

    const { error: payableError } = await supabase
        .from("vendor_payables")
        .insert({
            order_id: order.id,
            store_id: payload.store_id,
            amount: payload.subtotal
        });

    if (payableError) throw new Error(`Failed to create vendor payable: ${payableError.message}`);

    const { error: clearItemsError } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", payload.cart_id);

    if (clearItemsError) throw new Error(`Failed to clear cart items: ${clearItemsError.message}`);

    const { error: deleteCartError } = await supabase
        .from("carts")
        .delete()
        .eq("id", payload.cart_id);

    if (deleteCartError) throw new Error(`Failed to delete cart: ${deleteCartError.message}`);

    return { order_id: order.id };
}
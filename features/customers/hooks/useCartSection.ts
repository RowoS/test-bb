"use client";
 
import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";
import { CartByStore, AllCartItem, delivery_methods } from "../types/types";
import { getAllCartsForUser,updateCartItemQty, deleteCartItem } from "../libs/storeCart-actions";


 

export function useAllCarts() {
    const [cartsByStore, setCartsByStore] = useState<CartByStore[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
 
    useEffect(() => {
        fetchAllCarts();
    }, []);
 
    const fetchAllCarts = async () => {
        setIsLoading(true);
        setError(null);
        const supabase = createClient();
 
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) throw new Error("Not authenticated");
 
            const data = await getAllCartsForUser();

            const shaped: CartByStore[] = (data ?? [])
                .filter(cart => cart.cart_items && cart.cart_items.length > 0)
                .map(cart => {
                    const storeName = (cart.stores as any)?.store_name ?? "Unknown Store";
                    const items: AllCartItem[] = (cart.cart_items as any[]).map(ci => ({
                        id: ci.id,
                        cart_id: cart.id,
                        item_id: ci.item_id,
                        name: ci.name,
                        price: ci.price,
                        image: ci.image,
                        quantity: ci.quantity,
                        store_id: cart.store_id,
                        store_name: storeName,
                    }));
                    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
                    return { cart_id: cart.id, store_id: cart.store_id, store_name: storeName, items, subtotal };
                });
 
            setCartsByStore(shaped);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error("Failed to fetch all carts:", message);
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const updateItemQty = async (cartItemId: string, cartId: string, qty: number) => {
        if (qty <= 0) {
            await removeItem(cartItemId);
            return;
        }
        try {
            await updateCartItemQty(cartItemId, qty);
            setCartsByStore(prev =>
                prev.map(store => ({
                    ...store,
                    items: store.items.map(item =>
                        item.id === cartItemId ? { ...item, quantity: qty } : item
                    ),
                    subtotal: store.items
                        .map(item => item.id === cartItemId
                            ? { ...item, quantity: qty }
                            : item
                        )
                        .reduce((sum, i) => sum + i.price * i.quantity, 0),
                }))
            );
        } catch (err) {
            console.error("Failed to update qty:", err instanceof Error ? err.message : err);
        }
    };

    const removeItem = async (cartItemId: string) => {
        try {
            await deleteCartItem(cartItemId);
            setCartsByStore(prev =>
                prev
                    .map(store => {
                        const updatedItems = store.items.filter(i => i.id !== cartItemId);
                        return {
                            ...store,
                            items: updatedItems,
                            subtotal: updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
                        };
                    })
                    // Remove the store group entirely if it has no items left
                    .filter(store => store.items.length > 0)
            );
        } catch (err) {
            console.error("Failed to remove item:", err instanceof Error ? err.message : err);
        }
    };
 
    const totalItems = cartsByStore.reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.quantity, 0), 0);
 
    return { 
        cart_values: { cartsByStore, isLoading, error, totalItems },
        cart_functions: { updateItemQty, removeItem },
        refetch: fetchAllCarts,
    };
}
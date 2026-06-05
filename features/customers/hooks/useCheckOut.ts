"use client";

import { useState, useEffect, useCallback } from 'react';
import { CartByStore } from "../types/types";
import { delivery_methods } from "../types/types";
import { getStoreDeliveryMethod, placeOrder, toFulfillmentType } from "../libs/storeCart-actions";
import { useAddresses } from '@/features/profiles/hooks/useAddresses';


export type CheckoutStep = 1 | 2 | 3;

export function useCheckOut(cart: CartByStore, onClose: () => void) {
    const { values: { addresses } } = useAddresses();
    const [step, setStep] = useState<CheckoutStep>(1);
    const [fulfillment, setFulfillment] = useState<delivery_methods | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const [storeDeliveryMethod, setStoreDeliveryMethod] = useState<delivery_methods>(delivery_methods.both);
    const [isLoadingDeliveryMethod, setIsLoadingDeliveryMethod] = useState(true);

    const deliveryFee = fulfillment === delivery_methods.delivery ? 49 : 0;
    const total = cart.subtotal + deliveryFee;

    useEffect(() => {
        setIsLoadingDeliveryMethod(true);
    
        getStoreDeliveryMethod(cart.store_id)
            .then((method) => {
                setStoreDeliveryMethod(method);
                console.log("Returned method:", method); 
                if (method === delivery_methods.pickup) {
                    setFulfillment(delivery_methods.pickup);
                } else if (method === delivery_methods.delivery) {
                    setFulfillment(delivery_methods.delivery);
                }
                
            })
            .finally(() => setIsLoadingDeliveryMethod(false));
    }, [cart.store_id]);

    const goNext = () => {
        if (step === 2 && fulfillment === null) return;
        if (step < 3) setStep(prev => (prev + 1) as CheckoutStep);
    };
 
    const goBack = () => {
        if (step > 1) setStep(prev => (prev - 1) as CheckoutStep);
        else onClose();
    };

    const handleConfirm = async () => {
    if (fulfillment === delivery_methods.delivery && !selectedAddressId) {
        alert("Please select a delivery address.");
        return;
    }

    const selectedAddress = addresses.find(a => a.id === selectedAddressId) ?? null;

    try {
        await placeOrder({
                store_id: cart.store_id,
                cart_id: cart.cart_id,
                fulfillment: toFulfillmentType(fulfillment!),
                subtotal: cart.subtotal,
                delivery_fee: deliveryFee,
                total,
                notes: notes || undefined,
                delivery_address_id: selectedAddress?.id ?? null,
                delivery_landmark: selectedAddress?.landmark ?? null,
                delivery_barangay: selectedAddress?.barangay ?? null,
                delivery_city: selectedAddress?.city ?? null,
                delivery_latitude: selectedAddress?.latitude ?? null,
                delivery_longitude: selectedAddress?.longitude ?? null,
                items: cart.items.map(item => ({
                    item_id: item.item_id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
            });

            onClose();
        } catch (err) {
            console.error("Failed to place order:", err instanceof Error ? err.message : err);
            alert("Failed to place order. Please try again.");
        }
    };

    const availableMethods: delivery_methods[] = (() => {
        if (storeDeliveryMethod === delivery_methods.both) {
            return [delivery_methods.pickup, delivery_methods.delivery];
        }
        return [storeDeliveryMethod];
    })();

    return {
        step,
        fulfillment,
        selectedAddressId,
        notes,
        storeDeliveryMethod,
        availableMethods,
        isLoadingDeliveryMethod,
        deliveryFee,
        total,
        setFulfillment,
        setSelectedAddressId,
        setNotes,
        goNext,
        goBack,
        handleConfirm,
    };
}

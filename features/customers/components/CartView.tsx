"use client";

import { useState } from "react";
import { ShoppingCart, Store,Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { CartByStore, CartsViewProps } from "../types/types";
import { CheckoutModal } from "./CheckOutModal";


export default function CartsView({ cartsByStore, isLoading, totalItems, onUpdateQty, onRemoveItem }: CartsViewProps){

    const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
    const [checkoutCart, setCheckoutCart] = useState<CartByStore | null>(null);
    
    const handleCheckboxChange = (storeId: string) => {
        setSelectedStoreId(prev => prev === storeId ? null : storeId);
    };

    const handleCheckout = () => {
        const cart = cartsByStore.find(c => c.store_id === selectedStoreId);
        if (cart) setCheckoutCart(cart);
    };

    if (isLoading) {
        return <p className="text-gray-400 text-sm text-center py-12">Loading orders...</p>;
    }

    if (cartsByStore.length === 0) {
        return (
            <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No active orders</p>
            </div>
        );
    }
    
    return (
        <>
            <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        {totalItems} item{totalItems !== 1 ? "s" : ""} across {cartsByStore.length} store{cartsByStore.length !== 1 ? "s" : ""}
                    </p>
                    {selectedStoreId && (
                        <button
                            onClick={handleCheckout}
                            className="px-5 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Checkout
                        </button>
                    )}
                </div>

                {cartsByStore.map(cart => {
                    const isSelected = selectedStoreId === cart.store_id;

                    return (
                        <div
                            key={cart.store_id}
                            className={`bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-colors ${
                                isSelected ? "border-[#FF6B35]" : "border-transparent"
                            }`}
                        >
                            {/* Store header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Store className="w-4 h-4 text-[#FF6B35]" />
                                    <span className="font-semibold text-gray-900 text-sm">{cart.store_name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Checkbox */}
                                    <button
                                        onClick={() => handleCheckboxChange(cart.store_id)}
                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                                            isSelected
                                                ? "bg-[#FF6B35] border-[#FF6B35]"
                                                : "border-gray-300 hover:border-[#FF6B35]"
                                        }`}
                                    >
                                        {isSelected && (
                                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-gray-50">
                                {cart.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                <span className="text-gray-300 font-bold">{item.name.charAt(0)}</span>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-sm font-semibold text-[#FF6B35] mt-0.5">
                                                ₱{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Qty controls */}
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <button
                                                onClick={() => onUpdateQty(item.id, item.cart_id, item.quantity - 1)}
                                                className="w-7 h-7 rounded-full border border-gray-200 hover:border-[#FF6B35] hover:text-[#FF6B35] flex items-center justify-center transition-colors text-gray-500"
                                            >
                                                {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                                            </button>
                                            <span className="w-5 text-center text-sm font-semibold text-gray-800">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => onUpdateQty(item.id, item.cart_id, item.quantity + 1)}
                                                className="w-7 h-7 rounded-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white flex items-center justify-center transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                            <button
                                                onClick={() => onRemoveItem(item.id, item.cart_id)}
                                                className="w-7 h-7 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-400 flex items-center justify-center transition-colors ml-1"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Subtotal */}
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                                <span className="text-sm text-gray-500">
                                    Subtotal:{" "}
                                    <span className="font-semibold text-gray-900">
                                        ₱{cart.subtotal.toFixed(2)}
                                    </span>
                                </span>

                                <Link
                                    href={`/customer/store/${cart.store_id}`}
                                    className="px-4 py-1.5 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-xs font-medium rounded-lg transition-colors"
                                >
                                    Go to store
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Checkout modal */}
            {checkoutCart && (
                <CheckoutModal
                    open={!!checkoutCart}
                    onOpenChange={(open) => { if (!open) setCheckoutCart(null); }}
                    cart={checkoutCart}
                />
            )}
        </>
    );

}




"use client";

import { Minus, Plus, Trash2, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { CartItem } from "../types/types";

interface InlineCartProps {
    items: CartItem[];
    total: number;
    count: number;
    storeName?: string;
    onUpdateQty: (id: string, qty: number) => void;
    onRemoveItem: (id: string) => void;
    onClearCart: () => void;
    onCheckout: () => void;
}

export function InlineCart({
    items, total, count, storeName,
    onUpdateQty, onRemoveItem, onClearCart, onCheckout,
}: InlineCartProps) {
    const deliveryFee = 49;
    const orderTotal = total + deliveryFee;

    return (
        <div
            className="rounded-xl shadow-2xl sticky top-24 flex flex-col overflow-hidden"
            style={{
                background: "#f1f5f9",
                border: "1px solid #e2e8f0"
            }}
        >
            <div
                className="px-5 py-4"
                style={{
                    background: "linear-gradient(135deg, #3A6B9F 0%, #2A5480 100%)",
                    borderBottom: "1px solid rgba(255,255,255,0.1)"
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: "#FF6B35" }}
                        >
                            <ShoppingCart className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="font-bold text-white">Your Order</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {storeName && <p className="text-xs" style={{ color: "#bfdbfe" }}>from {storeName}</p>}
                        {items.length > 0 && (
                            <button
                                onClick={onClearCart}
                                className="text-xs transition-colors"
                                style={{ color: "#bfdbfe" }}
                                onMouseEnter={(e) => e.currentTarget.style.color = "#fca5a5"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#bfdbfe"}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto max-h-96">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                            style={{ background: "#e2e8f0" }}
                        >
                            <ShoppingBag size={24} style={{ color: "#94a3b8" }} />
                        </div>
                        <p className="font-medium text-[#1D3557] text-sm">Your cart is empty</p>
                        <p className="text-xs mt-1" style={{ color: "#64748b" }}>Add items from the menu to get started</p>
                    </div>
                ) : (
                    <div className="px-4 py-3 space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 rounded-xl p-3 transition-colors"
                                style={{
                                    background: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                }}
                            >
                                {/* Image */}
                                <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden">
                                    {item.image ? (
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center"
                                            style={{ background: "linear-gradient(135deg, #FF6B35, #F4D35E)" }}
                                        >
                                            <span className="text-white font-bold text-sm">{item.name.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-[#1D3557] text-sm truncate">{item.name}</p>
                                    <p className="text-sm font-semibold mt-1" style={{ color: "#FF6B35" }}>
                                        ₱{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button
                                        onClick={() => item.quantity === 1 ? onRemoveItem(item.id) : onUpdateQty(item.id, item.quantity - 1)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                                        style={{ background: "#e2e8f0" }}
                                        onMouseEnter={(e) => {
                                            if (item.quantity === 1) {
                                                e.currentTarget.style.background = "#fecaca";
                                                e.currentTarget.style.color = "#dc2626";
                                            } else {
                                                e.currentTarget.style.background = "#cbd5e1";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "#e2e8f0";
                                            e.currentTarget.style.color = "#1D3557";
                                        }}
                                    >
                                        {item.quantity === 1 ? <Trash2 size={12} style={{ color: "#64748b" }} /> : <Minus size={12} style={{ color: "#1D3557" }} />}
                                    </button>
                                    <span className="w-5 text-center text-sm font-bold text-[#1D3557]">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                                        style={{ background: "#e2e8f0" }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "#cbd5e1";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = "#e2e8f0";
                                        }}
                                    >
                                        <Plus size={12} style={{ color: "#1D3557" }} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
                <div className="px-5 py-4 space-y-3" style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span style={{ color: "#64748b" }}>Subtotal ({count} {count === 1 ? "item" : "items"})</span>
                            <span className="font-medium text-[#1D3557]">₱{total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span style={{ color: "#64748b" }}>Delivery fee</span>
                            <span className="font-medium text-[#1D3557]">₱{deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold pt-2" style={{ borderTop: "1px solid #e2e8f0" }}>
                            <span className="text-[#1D3557]">Total</span>
                            <span style={{ color: "#FF6B35" }}>₱{orderTotal.toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={onCheckout}
                        className="w-full py-3 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
                        style={{ background: "#FF6B35" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#E55A2B";
                            e.currentTarget.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#FF6B35";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        <ShoppingBag size={15} />
                        Place Order · ₱{orderTotal.toFixed(2)}
                    </button>
                    <div className="flex justify-center">
                        <Link
                            href="/customer?tab=cart"
                            className="text-xs transition-colors"
                            style={{ color: "#64748b" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = "#FF6B35"}
                            onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}
                        >
                            View all carts
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
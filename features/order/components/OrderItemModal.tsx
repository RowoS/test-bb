// features/order/components/OrderItemsModal.tsx
"use client";

import { X } from "lucide-react";
import { OrderItem } from "../types/types";

interface OrderItemsModalProps {
    storeName: string;
    items: OrderItem[];
    onClose: () => void;
}

export function OrderItemsModal({ storeName, items, onClose }: OrderItemsModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                    <div>
                        <h2 className="font-bold text-stone-800 text-base">Order Items</h2>
                        <p className="text-xs text-stone-400 mt-0.5">{storeName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors text-stone-400"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Items */}
                <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {items.map((item) => (
                        <div key={item.order_item_id} className="flex items-center gap-4">
                            {/* Image */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-stone-300 text-2xl font-bold">
                                            {item.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-stone-800 text-sm">{item.name}</p>
                                <p className="text-xs text-stone-400 mt-0.5">₱{item.price.toFixed(2)} each</p>
                            </div>

                            {/* Quantity */}
                            <div className="flex-shrink-0 text-right">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-50 text-orange-500 font-bold text-sm rounded-lg">
                                    x{item.quantity}
                                </span>
                                <p className="text-xs text-stone-500 mt-1">₱{item.subtotal.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between">
                    <p className="text-sm text-stone-500">{items.length} item{items.length !== 1 ? "s" : ""}</p>
                    <p className="text-sm font-bold text-stone-800">
                        ₱{items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    );
}
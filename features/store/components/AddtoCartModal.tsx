"use client";

import { useState } from "react";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { MenuItem } from "../types/types";

interface AddToCartModalProps {
    item: MenuItem;
    onConfirm: (item: MenuItem, quantity: number) => void;
    onClose: () => void;
}

export function AddToCartModal({ item, onConfirm, onClose }: AddToCartModalProps) {
    const [quantity, setQuantity] = useState(1);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

                {/* Header: small image + name */}
                <div className="flex items-center gap-5 p-6 border-b border-gray-100">
                    {item.image ? (
                        <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl font-bold text-orange-200">{item.name.charAt(0)}</span>
                        </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col justify-center self-stretch">
                        <h3 className="font-bold text-gray-900 text-base leading-snug">{item.name}</h3>
                        <p className="text-orange-500 font-semibold text-sm mt-0.5">₱{item.price.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="self-start w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
                    >
                        <X size={15} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-5">

                    {/* Quantity */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Quantity</span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-8 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="w-9 h-9 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Subtotal */}
                    <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
                        <span className="text-sm text-gray-500">Subtotal</span>
                        <span className="font-bold text-gray-900">₱{(item.price * quantity).toFixed(2)}</span>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => { onConfirm(item, quantity); onClose(); }}
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                    >
                        <ShoppingCart size={16} />
                        Add to Order · ₱{(item.price * quantity).toFixed(2)}
                    </button>

                </div>
            </div>
        </div>
    );
}
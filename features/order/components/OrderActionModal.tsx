// features/order/components/OrderActionsModal.tsx
"use client";

import { X, CheckCircle, XCircle, Star } from "lucide-react";
import { useState } from "react";
import { CustomerOrder } from "../types/types";

interface OrderActionsModalProps {
    order: CustomerOrder;
    activeTab: string;
    canCancel: boolean;
    onConfirmReceived: () => void;
    onCancelOrder: (reason: string) => void;
    onLeaveReview: () => void;
    onClose: () => void;
}

export function OrderActionsModal({
    order,
    activeTab,
    canCancel,
    onConfirmReceived,
    onCancelOrder,
    onLeaveReview,
    onClose,
}: OrderActionsModalProps) {
    const [isCancelling, setIsCancelling] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                    <div>
                        <h2 className="font-bold text-stone-800 text-base">Order Actions</h2>
                        <p className="text-xs text-stone-400 mt-0.5">#{order.order_id.slice(0, 8)}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors text-stone-400"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 space-y-3">
                    {/* Confirm Received */}
                    {activeTab === 'to_receive' && (
                        <button
                            onClick={() => { onConfirmReceived(); onClose(); }}
                            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors text-left group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center flex-shrink-0 transition-colors">
                                <CheckCircle size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-green-700 text-sm">Order Received</p>
                                <p className="text-xs text-green-500 mt-0.5">Confirm that you received your order</p>
                            </div>
                        </button>
                    )}

                    {/* Leave Review */}
                    {activeTab === 'history' && order.status === 'completed' && (
                        <button
                            onClick={() => { onLeaveReview(); onClose(); }}
                            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-colors text-left group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-yellow-100 group-hover:bg-yellow-200 flex items-center justify-center flex-shrink-0 transition-colors">
                                <Star size={20} className="text-yellow-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-yellow-700 text-sm">
                                    {order.review_id ? "Edit Review" : "Leave a Review"}
                                </p>
                                <p className="text-xs text-yellow-500 mt-0.5">Share your experience with this order</p>
                            </div>
                        </button>
                    )}

                    {/* Cancel Order */}
                    {activeTab === 'all' && canCancel && !isCancelling && (
                        <button
                            onClick={() => setIsCancelling(true)}
                            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors text-left group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-100 group-hover:bg-red-200 flex items-center justify-center flex-shrink-0 transition-colors">
                                <XCircle size={20} className="text-red-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-red-600 text-sm">Cancel Order</p>
                                <p className="text-xs text-red-400 mt-0.5">Request a cancellation for this order</p>
                            </div>
                        </button>
                    )}

                    {/* Cancel confirmation */}
                    {activeTab === 'all' && canCancel && isCancelling && (
                        <div className="p-4 rounded-xl border border-red-200 bg-red-50 space-y-3">
                            <p className="text-sm font-semibold text-red-600">Confirm Cancellation</p>
                            <input
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Reason for cancellation (optional)"
                                className="w-full px-3 py-2.5 border border-red-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { onCancelOrder(cancelReason); onClose(); }}
                                    className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                                >
                                    Confirm Cancel
                                </button>
                                <button
                                    onClick={() => { setIsCancelling(false); setCancelReason(""); }}
                                    className="flex-1 py-2.5 border border-stone-200 text-stone-500 rounded-lg text-sm hover:bg-stone-50 transition-colors"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Cannot cancel */}
                    {activeTab === 'all' && !canCancel && (
                        <div className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border border-stone-100 bg-stone-50">
                            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center flex-shrink-0">
                                <XCircle size={20} className="text-stone-300" />
                            </div>
                            <div>
                                <p className="font-semibold text-stone-400 text-sm">Cannot Cancel</p>
                                <p className="text-xs text-stone-400 mt-0.5">Order is already being prepared</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
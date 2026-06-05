import { CheckCircle, RefreshCw, X, XCircle } from "lucide-react";
import { useState } from "react";
import { VendorOrder } from "../types/types";
import { getStatusOptions } from "../libs/order_Status";

export function VendorOrderActionsModal({order,activeTab,onConfirm,onDecline,onStatusUpdate,onClose,}: {
    order: VendorOrder,activeTab: string, onConfirm: () => void, onDecline: (reason: string) => void,onStatusUpdate: (status: string) => void;
    onClose: () => void,
}) {
    const [isDeclining, setIsDeclining] = useState(false);
    const [declineReason, setDeclineReason] = useState("");

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

                <div className="px-6 py-4 space-y-3">
                    {/* Request tab — Accept / Decline */}
                    {activeTab === 'request' && !isDeclining && (
                        <>
                            <button
                                onClick={() => { onConfirm(); onClose(); }}
                                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors text-left group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-green-100 group-hover:bg-green-200 flex items-center justify-center flex-shrink-0 transition-colors">
                                    <CheckCircle size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-green-700 text-sm">Process Order</p>
                                    <p className="text-xs text-green-500 mt-0.5">Accept and start processing this order</p>
                                </div>
                            </button>

                            <button
                                onClick={() => setIsDeclining(true)}
                                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors text-left group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-red-100 group-hover:bg-red-200 flex items-center justify-center flex-shrink-0 transition-colors">
                                    <XCircle size={20} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-red-600 text-sm">Decline Order</p>
                                    <p className="text-xs text-red-400 mt-0.5">Reject this order request</p>
                                </div>
                            </button>
                        </>
                    )}

                    {/* Decline confirmation */}
                    {activeTab === 'request' && isDeclining && (
                        <div className="p-4 rounded-xl border border-red-200 bg-red-50 space-y-3">
                            <p className="text-sm font-semibold text-red-600">Confirm Decline</p>
                            <input
                                value={declineReason}
                                onChange={(e) => setDeclineReason(e.target.value)}
                                placeholder="Reason for declining (optional)"
                                className="w-full px-3 py-2.5 border border-red-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { onDecline(declineReason); onClose(); }}
                                    className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                                >
                                    Confirm Decline
                                </button>
                                <button
                                    onClick={() => { setIsDeclining(false); setDeclineReason(""); }}
                                    className="flex-1 py-2.5 border border-stone-200 text-stone-500 rounded-lg text-sm hover:bg-stone-50 transition-colors"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Running tab — status updates */}
                    {activeTab === 'running' && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
                                Update Order Status
                            </p>
                            {getStatusOptions(order.fulfillment).map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { onStatusUpdate(opt.value); onClose(); }}
                                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-stone-100 bg-stone-50 hover:bg-orange-50 hover:border-orange-200 transition-colors text-left group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-white group-hover:bg-orange-100 flex items-center justify-center flex-shrink-0 transition-colors border border-stone-100">
                                        <RefreshCw size={15} className="text-stone-400 group-hover:text-orange-500 transition-colors" />
                                    </div>
                                    <p className="font-medium text-stone-700 group-hover:text-orange-600 text-sm transition-colors">
                                        {opt.label}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
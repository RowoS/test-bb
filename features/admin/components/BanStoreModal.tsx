// features/admin/components/BanStoreModal.tsx
"use client";

import { useState } from "react";
import { X, ShieldOff } from "lucide-react";
import {BanStoreModalProps, BAN_REASONS} from "../types/types";

export function BanStoreModal({ storeName, onConfirm, onClose }: BanStoreModalProps) {
    const [reason, setReason] = useState<BAN_REASONS>(BAN_REASONS.SCAM_OR_FRAUDULENT_ACTIVITY);
    const [isBanning, setIsBanning] = useState(false);
    const banReasonOptions = Object.values(BAN_REASONS);

    const handleConfirm = async () => {
        setIsBanning(true);
        try {
            await onConfirm(reason);
            onClose();
        } finally {
            setIsBanning(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <ShieldOff className="w-5 h-5 text-red-500" />
                        <h2 className="font-bold text-[#1D3557] text-lg">Ban Store</h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <p className="text-sm text-gray-600">
                        You are about to ban <span className="font-semibold text-[#1D3557]">{storeName}</span>. This will prevent the store from being visible to customers.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-[#1D3557] mb-2">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value as BAN_REASONS)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent bg-white"
                        >
                            {banReasonOptions.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isBanning}
                            className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            {isBanning ? "Banning..." : "Ban Store"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
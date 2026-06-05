// features/admin/components/DeleteStoreModal.tsx
"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import {DeleteStoreModalProps} from "../types/types";

export function DeleteStoreModal({ storeName, onConfirm, onClose }: DeleteStoreModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
            onClose();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-red-500" />
                        <h2 className="font-bold text-[#1D3557] text-lg">Delete Store</h2>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-sm text-red-600 font-medium">⚠️ This action cannot be undone.</p>
                        <p className="text-sm text-red-500 mt-1">
                            Deleting this store will permanently remove all its data including menu items, orders, and reviews.
                        </p>
                    </div>

                    <p className="text-sm text-gray-600">
                        Type <span className="font-mono font-bold text-[#1D3557]">{storeName}</span> to confirm deletion.
                    </p>

                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={`Type "${storeName}" to confirm`}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    />

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={confirmText !== storeName || isDeleting}
                            className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? "Deleting..." : "Delete Store"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
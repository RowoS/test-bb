"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ReportReason, ReportStoreModalProps } from "../types/types";

const REPORT_REASONS = Object.values(ReportReason);

export default function ReportModal({ storeId, storeName, onClose, onSubmit, isSubmitting }: ReportStoreModalProps) {
    const [reason, setReason] = useState<ReportReason>(ReportReason.Scam);
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!reason) return;
        await onSubmit(reason, notes, storeId);
        setSubmitted(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-[#1D3557] text-lg">Report Store</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {submitted ? (
                    <div className="px-6 py-12 text-center">
                        <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h3 className="font-bold text-[#1D3557] mb-2">Report Submitted</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Thank you for your report. We'll review it as soon as possible.
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-[#FF6B35] text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <div className="px-6 py-5 space-y-5">
                        <p className="text-sm text-gray-500">
                            Reporting <span className="font-semibold text-[#1D3557]">{storeName}</span>
                        </p>

                        {/* Reason Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-[#1D3557] mb-2">
                                Reason <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value as ReportReason)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent bg-white text-gray-700"
                            >
                                {REPORT_REASONS.map((r) => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1D3557] mb-2">
                                Additional Details{" "}
                                <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Provide any extra details about the issue..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
                            />
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!reason || isSubmitting}
                            className="w-full py-3 bg-[#FF6B35] text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
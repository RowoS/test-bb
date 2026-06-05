"use client";

import { ArrowLeft, Shield,ShieldOff,Trash2, Flag, User} from "lucide-react";
import { BanStoreModal } from "./BanStoreModal";
import { DeleteStoreModal } from "./DeleteStoreModal";
import { useRouter } from "next/navigation";
import { useStoreReports } from "../hooks/useStoreReports";

export function AdminStoreReportDetail({ storeId, storeName, isBanned }: {
    storeId: string;
    storeName: string;
    isBanned: boolean;
}) {
    const router = useRouter();
    const { values, functions } = useStoreReports(storeId, isBanned);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-orange-300 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 text-gray-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-[#1D3557]">{storeName}</h1>
                                {values.banned && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                                        Banned
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 text-sm">
                                {values.reports.length} report{values.reports.length !== 1 ? "s" : ""} total
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {values.banned ? (
                            <button
                                onClick={functions.handleUnban}
                                className="flex items-center gap-2 px-4 py-2 border border-green-200 text-green-600 hover:bg-green-50 rounded-xl text-sm font-medium transition-colors"
                            >
                                <Shield className="w-4 h-4" />
                                Unban Store
                            </button>
                        ) : (
                            <button
                                onClick={() => functions.setIsBanModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-xl text-sm font-medium transition-colors"
                            >
                                <ShieldOff className="w-4 h-4" />
                                Ban Store
                            </button>
                        )}
                        <button
                            onClick={() => functions.setIsDeleteModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-xl text-sm font-medium transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Store
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-[#FF6B35]" />
                        <h2 className="font-bold text-[#1D3557]">All Reports</h2>
                    </div>

                    {values.isLoading ? (
                        <div className="p-12 text-center text-gray-400 text-sm">Loading...</div>
                    ) : values.reports.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 text-sm">No reports found.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {values.reports.map((report) => (
                                <div key={report.report_id} className="px-6 py-5">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F4D35E] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {report.customer_avatar ? (
                                                <img src={report.customer_avatar} alt={report.customer_username} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-4 h-4 text-white" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div>
                                                    <p className="font-semibold text-sm text-[#1D3557]">
                                                        {report.customer_username}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(report.created_at).toLocaleDateString("en-PH", {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric",
                                                            hour: "numeric",
                                                            minute: "2-digit",
                                                        })}
                                                    </p>
                                                </div>
                                                <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full flex-shrink-0">
                                                    {report.reason}
                                                </span>
                                            </div>

                                            {report.notes && (
                                                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-sm text-gray-600 leading-relaxed">{report.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {values.isBanModalOpen && (
                <BanStoreModal
                    storeName={storeName}
                    onConfirm={functions.handleBan}
                    onClose={() => functions.setIsBanModalOpen(false)}
                />
            )}

            {values.isDeleteModalOpen && (
                <DeleteStoreModal
                    storeName={storeName}
                    onConfirm={functions.handleDelete}
                    onClose={() => functions.setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
}
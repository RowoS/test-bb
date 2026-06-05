// features/admin/components/AdminReportsPage.tsx
"use client";

import { Search, Flag, ChevronRight, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminReports } from "../hooks/useAdminReports";
import AdminNavBar from "./AdminNavBar";

function timeAgo(dateStr: string | null) {
    if (!dateStr) return "—";
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function getSeverityColor(count: number) {
    if (count >= 10) return "bg-red-100 text-red-600";
    if (count >= 5) return "bg-orange-100 text-orange-600";
    return "bg-yellow-100 text-yellow-600";
}

export function AdminReportsPage() {
    const router = useRouter();
    const { values, functions } = useAdminReports();

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-5xl mx-auto px-6 py-8">
                <AdminNavBar />

                <div className="mb-6 pt-20">
                    <h1 className="text-2xl font-bold text-[#1D3557]">Store Reports</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Review and manage reports submitted by customers
                    </p>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={values.search}
                            onChange={(e) => functions.setSearch(e.target.value)}
                            placeholder="Search stores..."
                            className="w-full pl-10 pr-4 py-2.5  border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-[#FF6B35]" />
                        <h2 className="font-bold text-[#1D3557]">Reported Stores</h2>
                        <span className="ml-auto text-xs text-gray-400">{values.stores.length} store{values.stores.length !== 1 ? "s" : ""}</span>
                    </div>

                    {values.isLoading ? (
                        <div className="p-12 text-center text-gray-400 text-sm">Loading...</div>
                    ) : values.stores.length === 0 ? (
                        <div className="p-12 text-center">
                            <AlertTriangle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">
                                {values.search ? "No stores match your search." : "No reports yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {values.stores.map((store) => (
                                <div
                                    key={store.store_id}
                                    onClick={() => router.push(`/admin/dashboard/${store.store_id}`)}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                                >
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#F4D35E] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {store.store_logo ? (
                                            <img src={store.store_logo} alt={store.store_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-white font-bold text-lg">
                                                {store.store_name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-[#1D3557] group-hover:text-[#FF6B35] transition-colors">
                                            {store.store_name}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Latest report {timeAgo(store.latest_report_at)}
                                        </p>
                                    </div>

                                    {/* Report count badge */}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSeverityColor(store.report_count)}`}>
                                        {store.report_count} report{store.report_count !== 1 ? "s" : ""}
                                    </span>

                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF6B35] transition-colors flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
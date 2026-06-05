"use client";

import { MessageCircle, Flag, Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { StoreHeaderProps } from "../types/types";
import ReportModal from "./ReportModal";

type StoreTab = "shop" | "reviews";

export default function StoreHeader({
    name, description, rating, storeId,
    activeTab, onTabChange,
    onSubmitReport, isSubmittingReport,
}: StoreHeaderProps & {
    activeTab: StoreTab;
    onTabChange: (tab: StoreTab) => void;
}) {
    const router = useRouter();
    const [isReportOpen, setIsReportOpen] = useState(false);

    return (
        <>
            <div
                className="rounded-2xl shadow-2xl p-6 border mb-6"
                style={{
                    background: "linear-gradient(135deg, #2A4A6F 0%, #1D3557 100%)",
                    borderColor: "rgba(255,255,255,0.1)"
                }}
            >
                {/* Store Info */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold mb-2" style={{ color: "#ffffff" }}>
                            {name}
                        </h1>
                        <div className="flex items-center gap-4 flex-wrap text-sm" style={{ color: "#93c5fd" }}>
                            {rating != null && (
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4" style={{ fill: "#F4D35E", color: "#F4D35E" }} />
                                    <span className="font-medium" style={{ color: "#ffffff" }}>{rating.toFixed(1)}</span>
                                </div>
                            )}
                            {description && (
                                <span className="line-clamp-1" style={{ color: "#93c5fd" }}>{description}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tab Bar */}
                <div
                    className="flex items-center justify-between pt-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
                >
                    <div className="flex gap-2 items-center">
                        {(["shop", "reviews"] as StoreTab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className="px-6 py-2.5 rounded-lg font-medium transition-all"
                                style={
                                    activeTab === tab
                                        ? { background: "#FF6B35", color: "#ffffff" }
                                        : { background: "rgba(255,255,255,0.1)", color: "#ffffff" }
                                }
                                onMouseEnter={(e) => {
                                    if (activeTab !== tab) e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                                }}
                                onMouseLeave={(e) => {
                                    if (activeTab !== tab) e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                }}
                            >
                                {tab === "shop" ? "Shop" : "Reviews"}
                            </button>
                        ))}

                        {/* Divider */}
                        <div className="w-px h-8 mx-2 text-white">
                                |
                        </div>

                        {/* Chat Button */}
                        <button
                            onClick={() => router.push(`/customer/store/${storeId}/chat?from=store`)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all"
                            style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat with Store
                        </button>
                    </div>

                    {/* Report */}
                    <button
                        onClick={() => setIsReportOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors"
                        style={{
                            background: "rgba(239,68,68,0.2)",
                            color: "#fca5a5",
                            border: "1px solid rgba(248,113,113,0.3)"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.3)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                    >
                        <Flag className="w-4 h-4" />
                        Report
                    </button>
                </div>
            </div>

            {isReportOpen && (
                <ReportModal
                    storeId={storeId ?? ""}
                    storeName={name ?? ""}
                    onClose={() => setIsReportOpen(false)}
                    onSubmit={onSubmitReport}
                    isSubmitting={isSubmittingReport}
                />
            )}
        </>
    );
}
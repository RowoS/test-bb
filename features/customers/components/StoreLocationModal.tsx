"use client";

import { X } from "lucide-react";
import dynamic from "next/dynamic";

const BaybayMaps = dynamic(() => import("@/features/maps/components/index"), { ssr: false });

interface StoreLocationModalProps {
    storeName: string;
    lat: number;
    lng: number;
    onClose: () => void;
}

export function StoreLocationModal({ storeName, lat, lng, onClose }: StoreLocationModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-lg">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                        <p className="font-bold text-[#1D3557]">{storeName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Store Location</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                    >
                        <X size={16} className="text-gray-500" />
                    </button>
                </div>

                {/* Map */}
                <div style={{ height: "360px" }}>
                    <BaybayMaps
                        stores={[{ id: "store", name: storeName, lat, lng }]}
                        highlightedStoreId="store"
                    />
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400">{lat.toFixed(6)}, {lng.toFixed(6)}</p>
                    <button
                        onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank")}
                        className="flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
                    >
                        Get Directions
                    </button>
                </div>
            </div>
        </div>
    );
}
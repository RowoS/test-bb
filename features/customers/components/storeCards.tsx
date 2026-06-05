"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Star, Map } from "lucide-react";
import { StoreCardProps } from "../types/types";
import { StoreLocationModal } from "./StoreLocationModal";

export default function StoreCard({ store, onHover, onLeave }: StoreCardProps) {
    const [showMap, setShowMap] = useState(false);

    return (
        <>
            <Link
                href={`/customer/store/${store.id}`}
                onMouseEnter={() => onHover(store.id)}
                onMouseLeave={() => onLeave()}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer block"
            >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                    {store.store_logo ? (
                        <img
                            src={store.store_logo}
                            alt={store.store_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-300 text-4xl font-bold">{store.store_name.charAt(0)}</span>
                        </div>
                    )}

                    {store.latitude && store.longitude && (
                        <button
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setShowMap(true); }}
                            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition-colors shadow-sm"
                            title="View on map"
                        >
                            <Map className="w-4 h-4 text-gray-500" />
                        </button>
                    )}

                    {store.barangay_name && (
                        <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-0.5 rounded text-xs">
                            {store.barangay_name}
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                        <h3 className="font-bold text-gray-900 line-clamp-1 flex-1">{store.store_name}</h3>
                        {store.average_rating && store.average_rating > 0 && (
                            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                <Star className="w-3.5 h-3.5 fill-[#F4D35E] text-yellow-400" />
                                <span className="text-sm font-semibold text-gray-900">
                                    {store.average_rating.toFixed(1)}
                                </span>
                            </div>
                        )}
                    </div>

                    {store.store_description && (
                        <p className="text-xs text-gray-500 line-clamp-1 mb-2">{store.store_description}</p>
                    )}

                    {store.address && (
                        <div className="flex items-center gap-1 mb-3">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <p className="text-xs text-gray-500 line-clamp-1">{store.address}</p>
                        </div>
                    )}

                    <span className="block w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white py-2 rounded-lg font-medium text-sm transition-colors text-center">
                        Go to Store
                    </span>
                </div>
            </Link>

            {showMap && store.latitude && store.longitude && (
                <StoreLocationModal
                    storeName={store.store_name}
                    lat={store.latitude}
                    lng={store.longitude}
                    onClose={() => setShowMap(false)}
                />
            )}
        </>
    );
}
"use client";
import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import {useMapOverlay} from "@/features/maps/hooks/UseMapOverlay";
import { UseMapOverlayOptions } from "./types/types";
import dynamic from "next/dynamic";

const BaybayMaps = dynamic(() => import("@/features/maps/components/index"), { ssr: false });




export default function MapOverlay({ onClose, onConfirm }: UseMapOverlayOptions) {
  const { location, geocoding, handleLocationSelect, handleConfirm } = useMapOverlay({ onConfirm, onClose });


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      <div className="bg-[#2D2D2D] rounded-2xl w-full max-w-3xl p-6">
        <h2 className="text-white text-lg font-bold mb-4">Update Store Location</h2>

        <div className="mb-3 min-h-[48px]">
          {geocoding ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Getting address...
            </div>
          ) : location ? (
            <div className="bg-[#1D1D1D] rounded-lg px-4 py-3 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-white text-sm font-medium">
                  {location.barangay
                    ? `Brgy. ${location.barangay}`
                    : `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
                </span>
              </div>
              {location.fullAddress && (
                <p className="text-gray-400 text-xs pl-6 line-clamp-2">{location.fullAddress}</p>
              )}
              <p className="text-gray-500 text-xs pl-6">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Click on the map to pin your store location</p>
          )}

          {location && !location.isInBaybay && (
            <p className="text-red-500 text-xs mt-1">
              Warning: The selected location is outside of Baybay City. Please select a location within the city limits.
            </p>
          )}
        </div>

        {/* Map */}
        <div className="w-full h-[60vh] rounded-lg overflow-hidden mb-4">
          <BaybayMaps onLocationSelect={handleLocationSelect} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!location || geocoding || !location.isInBaybay}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}

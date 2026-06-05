"use client"

import { useEffect, useRef } from "react";
import { MousePointer2, Clock, X } from "lucide-react";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";
import { OrderMapProps } from "../types/types";
const BaybayMaps = dynamic(() => import("@/features/maps/components/index"), { ssr: false });

export function OrderMap({ isOpen, onClose, lat, lng, address }: OrderMapProps) {
  const overlayRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);


  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const position: LatLngExpression = [lat, lng];

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >

      <div
        ref={overlayRef}
        className="bg-white rounded-2xl overflow-hidden flex flex-col"
        style={{ width: "min(560px, 100%)", height: "min(600px, 90vh)" }}
      >

        <div className="flex items-start justify-between px-5 py-4 border-b border-stone-100 flex-shrink-0">
          <div>
            <p className="text-sm font-semibold text-stone-800">Delivery Location</p>
            <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{address}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-600"
          >
            <X size={16} />
          </button>
        </div>


        <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0">
                <BaybayMaps
                posix={position}
                zoom={15}
                stores={[{ id: "delivery", name: address, lat, lng }]}
                />
            </div>
        </div>

        <div className="px-5 py-4 border-t border-stone-100 flex-shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Clock size={12}/>
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </div>
          <button
            onClick={handleGetDirections}
           className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 border border-green-700 text-orange-400 text-sm font-semibold rounded-xl transition-colors"
          >
            Get Directions
            <MousePointer2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
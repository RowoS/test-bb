"use client";

import { Search } from "lucide-react";
import {SearchTabProps } from "../types/types";

export default function SearchTab({searchMode,textQuery, barangays, selectedBarangay, isLoadingBarangays, isLoadingStores,
        onModeSwitch, onSelectBarangay, onClearSelection, onTextChange, onSearch}:SearchTabProps) {
    
    return (
        <div className="flex items-center gap-2 pb-2">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                <button
                    onClick={() => onModeSwitch("barangay")}
                    className={`px-3 py-1 rounded-md text-xs transition-colors ${
                        searchMode === "barangay"
                            ? "bg-white text-gray-800 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Barangay
                </button>
                <button
                    onClick={() => onModeSwitch("text")}
                    className={`px-3 py-1 rounded-md text-xs transition-colors ${
                        searchMode === "text"
                            ? "bg-white text-gray-800 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                    Name
                </button>
            </div>

            {/* Input */}
            {searchMode === "barangay" ? (
                <select
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] w-44"
                    value={selectedBarangay?.id ?? ""}
                    onChange={(e) => {
                        const found = barangays.find(b => b.id === e.target.value);
                        if (found) onSelectBarangay(found);
                        else onClearSelection();
                    }}
                >
                    <option value="">
                        {isLoadingBarangays ? "Loading..." : "Select barangay"}
                    </option>
                    {barangays.map(b => (
                        <option key={b.id} value={b.id}>{b.barangay}</option>
                    ))}
                </select>
            ) : (
                <div className="flex gap-1">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                            type="text"
                            value={textQuery}
                            onChange={(e) => onTextChange(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && onSearch()}
                            placeholder="Store name..."
                            className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] w-44"
                        />
                    </div>
                    <button
                        onClick={onSearch}
                        disabled={!textQuery.trim() || isLoadingStores}
                        className="px-3 py-1.5 bg-[#FF6B35] hover:bg-[#FF6B35]/90 disabled:opacity-50 text-white rounded-lg text-sm"
                    >
                        Go
                    </button>
                </div>
            )}
        </div>
    );

}
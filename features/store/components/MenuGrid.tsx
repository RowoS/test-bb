"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { MenuGridProps, MenuItem } from "../types/types";
import { DescriptionModal } from "./MenuItemDescriptionModal";

export default function MenuGrid({ categories, isLoading, searchQuery, activeTab, tabs,
    onSearchChange, onTabChange, onAddToCart }: MenuGridProps) {

    const [descItem, setDescItem] = useState<MenuItem | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>(tabs[0] || "All");

    // Filter categories based on selected category
    const filteredCategories = selectedCategory === "All" 
        ? categories 
        : categories.filter(cat => cat.name === selectedCategory);

    return (
        <div
            className="rounded-xl p-4 mb-4"
            style={{ background: "linear-gradient(135deg, #fafafa 0%, #fff8f5 100%)", border: "1px solid #ffe4d4" }}
        >
            {/* Search */}
            <div className="flex items-center gap-4 mb-4">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search in menu"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-1.5 border border-orange-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                    />
                </div>
            </div>

            {/* Scrollable Category Tabs - Pill Style */}
            <div className="mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin" style={{ scrollbarWidth: "thin" }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setSelectedCategory(tab)}
                            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all text-xs ${
                                selectedCategory === tab
                                    ? "bg-[#FF6B35] text-white shadow-md"
                                    : "bg-white text-[#1D3557] hover:bg-gray-100 shadow-sm border border-gray-200"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Content - Scrollable when too large */}
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
                {isLoading && <p className="text-gray-400 text-sm text-center py-8">Loading menu...</p>}
                {!isLoading && filteredCategories.length === 0 && (
                    <p className="text-gray-400 text-sm text-center py-8">No items found</p>
                )}

                {filteredCategories.map((category) => (
                    <div key={category.id} className="mb-6">
                        <h2 className="text-xs font-bold text-[#1D3557] uppercase tracking-wide mb-3 flex items-center gap-2">
                            <span
                                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                                style={{ background: "#FF6B35" }}
                            />
                            {category.name}
                        </h2>

                        <div className="grid grid-cols-3 gap-3">
                            {(category.items ?? []).map((item) => (
                                <div
                                    key={item.id}
                                    className={`rounded-xl flex flex-col gap-1.5 overflow-hidden transition-shadow hover:shadow-md ${
                                        item.is_available ? "" : "opacity-60"
                                    }`}
                                    style={{
                                        background: "#ffffff",
                                        border: "1px solid #ffe4d4",
                                        padding: "0 0 8px 0",
                                    }}
                                >
                                    {/* Image — full width, no padding */}
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-20 object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-20 flex items-center justify-center"
                                            style={{ background: "linear-gradient(135deg, #fff5f0, #fef3e2)" }}
                                        >
                                            <span className="text-orange-200 text-2xl font-bold">
                                                {item.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="px-2">
                                        <p className="font-semibold text-xs text-[#1D3557] truncate">{item.name}</p>

                                        {item.description && (
                                            <button
                                                onClick={() => setDescItem(item)}
                                                className="text-left text-xs text-gray-400 hover:text-orange-500 transition-colors line-clamp-2 break-words w-full"
                                            >
                                                {item.description}
                                            </button>
                                        )}

                                        <div className="flex items-center justify-between mt-1.5">
                                            <p className="text-[#FF6B35] font-bold text-xs">₱{item.price.toFixed(2)}</p>
                                            <button
                                                onClick={() => onAddToCart(item)}
                                                disabled={!item.is_available}
                                                className="w-6 h-6 rounded-md flex items-center justify-center transition-colors disabled:opacity-40 text-white"
                                                style={{ background: "#FF6B35" }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = "#d85327"}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "#FF6B35"}
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {descItem && (
                <DescriptionModal item={descItem} onClose={() => setDescItem(null)} />
            )}
        </div>
    );
}
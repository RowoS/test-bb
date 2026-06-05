"use client";
import { MapPin, ShoppingCart, Truck, MessageSquare } from "lucide-react";
import { Tab, TabBarProps } from "../types/types";

const tabs = [
    { id: "shops" as Tab,    label: "Shops",    icon: <MapPin className="w-4 h-4" /> },
    { id: "delivery" as Tab, label: "Delivery", icon: <Truck className="w-4 h-4" /> },
    { id: "cart" as Tab,     label: "Cart",     icon: <ShoppingCart className="w-4 h-4" /> },
    { id: "chats" as Tab, label: "Chats", icon: <MessageSquare className="w-4 h-4" /> },
];

export default function TabBar({activeTab, onChange, rightSlot}: TabBarProps){
    return (
        <div className="flex items-center border-b border-gray-200 mb-6">
            <div className="flex items-center gap-6 flex-1">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`pb-3 px-2 font-medium transition-colors relative flex items-center gap-2 ${
                            activeTab === tab.id
                                ? "text-[#FF6B35]"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]" />
                        )}
                    </button>
                ))}
            </div>

            {rightSlot && (
                <div className="pb-2">
                    {rightSlot}
                </div>
            )}
        </div>
    );
}
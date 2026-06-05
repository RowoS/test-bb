"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, MessageSquare, ShoppingBag, Truck, Check, RefreshCw } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import type { Notification } from "../types/types";

type NotificationsDropdownProps = {
    onOpenChange?: (isOpen: boolean) => void;
};

function timeAgo(dateStr: string) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(dateStr).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

function NotificationIcon({ type }: { type: Notification["type"] }) {
    const base = "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0";
    if (type === "message") return (
        <div className={`${base} bg-blue-100`}>
            <MessageSquare className="w-4 h-4 text-blue-500" />
        </div>
    );
    if (type === "order") return (
        <div className={`${base} bg-orange-100`}>
            <ShoppingBag className="w-4 h-4 text-orange-500" />
        </div>
    );
    return (
        <div className={`${base} bg-green-100`}>
            <Truck className="w-4 h-4 text-green-500" />
        </div>
    );
}

export function NotificationsDropdown({ onOpenChange }: NotificationsDropdownProps) {
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { values, functions} = useNotifications();

    // close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                functions.setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Notify parent when open state changes
    useEffect(() => {
        onOpenChange?.(values.isOpen);
    }, [values.isOpen, onOpenChange]);

    const handleNotificationClick = async (notification: Notification) => {
        await functions.markAsRead(notification.id);
        functions.setIsOpen(false);
        if (notification.url) router.push(notification.url);
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => functions.setIsOpen(!values.isOpen)}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    values.unreadCount > 0 
                        ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                        : "bg-accent-orange hover:bg-hover-orange"
                }`}
            >
                <Bell className={`w-5 h-5 transition-colors duration-200 ${
                    values.unreadCount > 0 ? "text-white" : "text-black"
                }`} />
            </button>

            {values.isOpen && (
                <div className="absolute right-0 top-12 w-[480px] bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-[#1D3557] text-base">Notifications</h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={functions.fetch}
                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                                title="Refresh notifications"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            {values.unreadCount > 0 && (
                                <button
                                    onClick={functions.markAllAsRead}
                                    className="flex items-center gap-1 text-xs text-[#FF6B35] hover:text-orange-600 transition-colors"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-y-auto divide-y divide-gray-50" style={{ height: "300px" }}>
                        {values.isLoading ? (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                Loading...
                            </div>
                        ) : values.notifications.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                <Bell className="w-10 h-10 text-gray-200 mb-2" />
                                <p className="text-gray-400 text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            values.notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`flex items-start gap-4 px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        !n.is_read ? "bg-orange-50/50" : ""
                                    }`}
                                >
                                    <NotificationIcon type={n.type} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${!n.is_read ? "font-semibold text-[#1D3557]" : "text-gray-700"}`}>
                                            {n.title}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{n.body}</p>
                                        <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                                    </div>
                                    {!n.is_read && (
                                        <div className="w-2 h-2 bg-[#FF6B35] rounded-full flex-shrink-0 mt-1.5" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {values.notifications.length > 3 && (
                        <div className="border-t border-gray-100 px-6 py-3 text-center">
                            <button className="text-sm text-[#FF6B35] hover:text-orange-600 font-medium transition-colors">
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function usePageTab() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("tab") === "cart" ? "cart" : "shops";
    const [activeTab, setActiveTab] = useState<"shops" | "delivery" | "cart" | "chats">(initialTab);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "cart") setActiveTab("cart");
        if (tab === "delivery") setActiveTab("delivery");
        if (tab === "chats") setActiveTab("chats");
        if (tab === "shops") setActiveTab("shops");
    }, [searchParams]);

    return { activeTab, setActiveTab };
}
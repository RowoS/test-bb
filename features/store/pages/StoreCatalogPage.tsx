"use client";

import { useState } from "react";
import { useStorePage } from "../hooks/useStorePage";
import StoreHeader from "../components/StoreHeader";
import StoreReviewsSection from "../components/StoreReviewSection";
import MenuGrid from "../components/MenuGrid";
import { InlineCart } from "../components/CartDrawer";
import { AddToCartModal } from "../components/AddtoCartModal";
import { MenuItem } from "../types/types";
import {StoreCheckoutModal} from "../components/StoreCheckOutModel";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";


type StoreTab = "shop" | "reviews";

export default function StoreCatalogPage({ storeId }: { storeId: string }) {
    const router = useRouter();
    const [pendingItem, setPendingItem] = useState<MenuItem | null>(null);
    const [activeStoreTab, setActiveStoreTab] = useState<StoreTab>("shop");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const {
        categories, isLoading, searchQuery, activeTab, tabs,
        storeInfo, setSearchQuery, setActiveTab, cart,
        submitReport, submittingReport,
    } = useStorePage(storeId);

    const handleAddToCart = async (item: MenuItem, quantity: number) => {
        const existing = cart.values.items.find(ci => ci.item_id === item.id);
        if (existing) {
            await cart.actions.updateQty(existing.id, existing.quantity + quantity);
        } else {
            await cart.actions.addItem(item, quantity);
        }
    };


    return (
        <div 
            className="min-h-screen"
            style={{
                background: "linear-gradient(135deg, #FFF5F0 0%, #FFE8DC 50%, #FFF0E6 100%)"
            }}
        >
            <div
                className="max-w-7xl mx-auto px-4 pt-20 relative"
                style={{ marginTop: "-32px" }}
            >
                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#FF6B35] transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <StoreHeader
                    name={storeInfo.name ?? "Unknown Store"}
                    description={storeInfo.description ?? ""}
                    rating={storeInfo.rating ?? null}
                    storeId={storeId}
                    activeTab={activeStoreTab}
                    onTabChange={setActiveStoreTab}
                    onSubmitReport={submitReport}
                    isSubmittingReport={submittingReport}
                />
            </div>
            <div className="max-w-7xl mx-auto px-4 py-4">
                {activeStoreTab === "shop" ? (
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                        <div style={{ flex: 7, minWidth: 0 }}>
                            <MenuGrid
                                categories={categories}
                                isLoading={isLoading}
                                searchQuery={searchQuery}
                                activeTab={activeTab}
                                tabs={tabs}
                                onSearchChange={setSearchQuery}
                                onTabChange={setActiveTab}
                                onAddToCart={(item) => setPendingItem(item)}
                            />
                        </div>
                        <div style={{ flex: 3, minWidth: 0 }}>
                            <InlineCart
                                items={cart.values.items}
                                total={cart.values.total}
                                count={cart.values.count}
                                storeName={storeInfo.name}
                                onUpdateQty={cart.actions.updateQty}
                                onRemoveItem={cart.actions.removeItem}
                                onClearCart={cart.actions.clearCart}
                                onCheckout={() => {setIsCheckoutOpen(true)}}
                            />
                        </div>
                    </div>
                ) : (
                    <StoreReviewsSection storeId={storeId} />
                )}
            </div>

            {pendingItem && (
                <AddToCartModal
                    item={pendingItem}
                    onConfirm={handleAddToCart}
                    onClose={() => setPendingItem(null)}
                />
            )}


            {isCheckoutOpen && cart.values.cartId && (
                <StoreCheckoutModal
                    open={isCheckoutOpen}
                    onOpenChange={setIsCheckoutOpen}
                    storeId={storeId}
                    storeName={storeInfo.name ?? ""}
                    cartId={cart.values.cartId}
                    items={cart.values.items}
                    subtotal={cart.values.total}
                    onUpdateQty={cart.actions.updateQty}
                    onRemoveItem={cart.actions.removeItem}
                />
            )}

            
        </div>
    );
}
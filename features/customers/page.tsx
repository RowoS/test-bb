"use client";

import Image from "next/image";
import { useSearch } from "@/features/customers/hooks/useSearch";
import { useAllCarts } from "@/features/customers/hooks/useCartSection";
import { CustomerOrdersSection } from "../order/components/CustomerOrderSection";
import { CustomerChatList } from "../chat/components/CustomerChatList";
import { usePageTab } from "./hooks/usePageTabs";
import CustomerNavBar from "./components/CustomerNavBar";
import CartsView from "./components/CartView";
import TabBar from "./components/TabBar";
import StoreCard from "./components/storeCards";
import SearchTab from "./components/SearchTab";

export default function CustomerHomePage() {
    const { activeTab, setActiveTab } = usePageTab();
    const { cart_values, cart_functions } = useAllCarts();
    const { values, functions } = useSearch();

    return (
        <div className="min-h-screen bg-gray-50">
            <CustomerNavBar />
            <main className="max-w-7xl mx-auto px-4 py-6 md:px-6 pt-20">
                <TabBar
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    rightSlot={
                        activeTab === "shops" && (
                            <SearchTab
                                searchMode={values.searchMode}
                                textQuery={values.textQuery}
                                barangays={values.barangays}
                                selectedBarangay={values.selectedBarangay}
                                isLoadingBarangays={values.isLoadingBarangays}
                                isLoadingStores={values.isLoadingStores}
                                onModeSwitch={functions.handleModeSwitch}
                                onSelectBarangay={functions.handleSelectBarangay}
                                onClearSelection={functions.handleClearSelection}
                                onTextChange={functions.setTextQuery}
                                onSearch={functions.handleTextSearch}
                            />
                        )
                    }
                />

                {activeTab === "shops" && (
                    <div
                        className="rounded-2xl p-6 mt-4"
                        style={{ background: "#f5f0e8" }}
                    >
                        <div className="flex justify-start mb-4 text-sm text-gray-600">
                            Store Results: {values.stores.length}
                        </div>

                        {values.isLoadingStores ? (
                            <div className="col-span-3 py-12 flex justify-center items-center">
                                <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
                                <span className="ml-3 text-gray-500">Loading stores...</span>
                            </div>
                        ) : values.stores.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Image
                                    src="/stores_no_found.png"
                                    alt="No stores found"
                                    width={200}
                                    height={200}
                                    className="opacity-80"
                                />
                                <p className="mt-4 text-gray-500 text-sm">
                                    No stores match your criteria.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {values.stores.map(store => (
                                    <StoreCard
                                        key={store.id}
                                        store={store}
                                        onHover={() => {}}
                                        onLeave={() => {}}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "chats" && <CustomerChatList />}
                {activeTab === "delivery" && <CustomerOrdersSection />}
                {activeTab === "cart" && (
                    <CartsView
                        cartsByStore={cart_values.cartsByStore}
                        isLoading={cart_values.isLoading}
                        totalItems={cart_values.totalItems}
                        onUpdateQty={cart_functions.updateItemQty}
                        onRemoveItem={cart_functions.removeItem}
                    />
                )}
            </main>
        </div>
    );
}
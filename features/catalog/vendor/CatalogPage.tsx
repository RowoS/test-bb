"use client";

import { Search, Plus, FolderPlus, MoreVertical, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useCatalogPage } from "../hooks/useCatalogPage";
import ProductFormModal from "../components/AddProductModal";
import AddCategoryModal from "../components/AddCategoryModal";
import EditProductModal from "../components/EditProductModal";
import { useState } from "react";

export default function CatalogPage() {
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const [modalEditItem, setModalEditItem] = useState<any>(null); // Separate state for modal edit

    const {
        data: { isModalOpen, isCategoryModalOpen, searchQuery, activeTab, tabs, editFields, editingItemId },
        Menufunctions: { setSearchQuery, setActiveTab, setModalOpen, setCategoryModalOpen, setEditingItemId, setEditFields, handleSaveEdit, handleStartEdit },
        categories: visibleCategories,
        ...menu
    } = useCatalogPage();

    const handleModalEdit = (item: any) => {
        setModalEditItem(item);
        setEditFields({
            name: item.name,
            description: item.description || "",
            price: item.price.toString(),
            image: item.image || "",
        });
    };

    const handleModalSave = async (categoryId: string, itemId: string) => {
        await handleSaveEdit(categoryId, itemId);
        setModalEditItem(null);
    };

    return (
        <div className="size-full flex flex-col">
            <div className="flex-1 overflow-auto">
                <div className="p-8">

                    {menu.values.error && <p className="text-red-500 text-sm mb-4">{menu.values.error}</p>}
                    {menu.values.success && <p className="text-green-500 text-sm mb-4">✓ {menu.values.success}</p>}

                    {/* Action Buttons */}
                    <div className="mb-6 flex items-center gap-3">
                        <button
                            onClick={() => setCategoryModalOpen(true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                        >
                            <FolderPlus size={16} />
                            Add Category
                        </button>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                        >
                            <Plus size={16} />
                            Add New Product
                        </button>
                    </div>

                    <div className="bg-white rounded-xl overflow-hidden mb-6">

                        <div
                            className="px-6 pt-5 pb-0"
                            style={{ background: "linear-gradient(135deg, #3A6B9F 0%, #2A5480 100%)" }}
                        >
                            {/* Search */}
                            <div className="relative mb-6 max-w-sm">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.6)" }} />
                                <input
                                    type="text"
                                    placeholder="Search in menu"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        background: "rgba(255,255,255,0.12)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        color: "#ffffff",
                                    }}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] placeholder-blue-300"
                                />
                            </div>

                            {/* Tabs with more spacing above */}
                            <div className="pt-2 pb-3">
                                <div className="flex gap-8 overflow-x-auto">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className="pb-2 px-1 text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0"
                                            style={{ color: tab === activeTab ? "#ffffff" : "rgba(255,255,255,0.55)" }}
                                        >
                                            {tab}
                                            {tab === activeTab && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Separator border moved lower */}
                        <div className="border-t border-gray-200" />

                        <div className="p-6">
                            {menu.values.isLoading && (
                                <p className="text-gray-400 text-sm text-center py-8">Loading menu...</p>
                            )}
                            {!menu.values.isLoading && visibleCategories.length === 0 && (
                                <p className="text-gray-400 text-sm text-center py-8">No items found</p>
                            )}

                            {visibleCategories.map((category) => (
                                <div key={category.id} className="mb-8">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">{category.name}</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {(category.items ?? []).map((item) => (
                                            <div
                                                key={item.id}
                                                className={`border rounded-xl p-4 flex gap-3 relative ${
                                                    item.is_available ? "border-gray-200" : "border-gray-100 opacity-60"
                                                }`}
                                            >

                                                {item.id === editingItemId && !modalEditItem ? (
                                                    <div className="flex gap-3 w-full">
                                                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                            {editFields.image
                                                                ? <img src={editFields.image} alt="" className="w-full h-full object-cover" />
                                                                : <span className="text-gray-300 text-2xl font-bold">{editFields.name.charAt(0)}</span>
                                                            }
                                                        </div>
                                                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                                                            <input
                                                                value={editFields.name}
                                                                onChange={(e) => setEditFields(f => ({ ...f, name: e.target.value }))}
                                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                placeholder="Name"
                                                            />
                                                            <input
                                                                value={editFields.description}
                                                                onChange={(e) => setEditFields(f => ({ ...f, description: e.target.value }))}
                                                                className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                placeholder="Description (optional)"
                                                            />
                                                            <input
                                                                type="number"
                                                                value={editFields.price}
                                                                onChange={(e) => setEditFields(f => ({ ...f, price: e.target.value }))}
                                                                className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                placeholder="Price"
                                                                min="0"
                                                                step="0.01"
                                                            />
                                                            <input
                                                                value={editFields.image}
                                                                onChange={(e) => setEditFields(f => ({ ...f, image: e.target.value }))}
                                                                className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                placeholder="Image URL (optional)"
                                                            />
                                                            <div className="flex gap-2 mt-1">
                                                                <button
                                                                    onClick={() => handleSaveEdit(category.id, item.id)}
                                                                    disabled={menu.values.isLoading}
                                                                    className="px-3 py-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded text-xs font-medium"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingItemId(null)}
                                                                    className="px-3 py-1 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded text-xs"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                                <span className="text-gray-300 text-2xl font-bold">
                                                                    {item.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                                            {item.description && (
                                                                <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.description}</p>
                                                            )}
                                                            <p className="text-orange-500 font-semibold mt-1">₱{item.price.toFixed(2)}</p>
                                                        </div>

                                                        <div className="relative flex-shrink-0">
                                                            <button
                                                                onClick={() => setDropdownOpen(dropdownOpen === item.id ? null : item.id)}
                                                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                            >
                                                                <MoreVertical size={16} className="text-gray-400" />
                                                            </button>
                                                            
                                                            {dropdownOpen === item.id && (
                                                                <>
                                                                    <div
                                                                        className="fixed inset-0 z-10"
                                                                        onClick={() => setDropdownOpen(null)}
                                                                    />
                                                                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                                                        <button
                                                                            onClick={() => {
                                                                                handleModalEdit(item);
                                                                                setDropdownOpen(null);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                                        >
                                                                            <Pencil size={14} />
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                menu.functions.handleToggleAvailability(category.id, item.id, !item.is_available);
                                                                                setDropdownOpen(null);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                                        >
                                                                            {item.is_available ? (
                                                                                <>
                                                                                    <ToggleRight size={14} className="text-orange-500" />
                                                                                    Mark Unavailable
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <ToggleLeft size={14} />
                                                                                    Mark Available
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                menu.functions.handleDeleteItem(category.id, item.id);
                                                                                setDropdownOpen(null);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <ProductFormModal
                open={isModalOpen}
                onOpenChange={setModalOpen}
                categories={menu.values.categories}
                onSubmit={menu.functions.handleAddItem}
                isLoading={menu.values.isLoading}
            />

            <AddCategoryModal
                open={isCategoryModalOpen}
                onOpenChange={setCategoryModalOpen}
                onSubmit={menu.functions.handleAddCategory}
                isLoading={menu.values.isLoading}
            />

            {modalEditItem && (
                <EditProductModal
                    open={!!modalEditItem}
                    onOpenChange={(open) => { if (!open) setModalEditItem(null); }}
                    item={modalEditItem}
                    editFields={editFields}
                    setEditFields={setEditFields}
                    categories={menu.values.categories}
                    isLoading={menu.values.isLoading}
                    onSave={(categoryId) => handleModalSave(categoryId, modalEditItem.id)}
                />
            )}
        </div>
    );
}
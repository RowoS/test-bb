"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Upload } from "lucide-react";
import { MenuItem, MenuCategory, EditProductModalProps } from "../types/types";
import { useEffect, useState } from "react";

export default function EditProductModal({
    open, onOpenChange, item, editFields, setEditFields,
    categories, isLoading, onSave,
}: EditProductModalProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>(() =>
        categories.find(c => c.items?.some(i => i.id === item.id))?.id ?? ""
    );

    useEffect(() => {
        setSelectedCategory(
            categories.find(c => c.items?.some(i => i.id === item.id))?.id ?? ""
        );
    }, [item.id, categories]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditFields(f => ({ ...f, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[70]" />
                <Dialog.Content className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <Dialog.Title className="text-lg font-semibold text-gray-900">
                                    Edit Product
                                </Dialog.Title>
                                <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-xs uppercase tracking-wide text-gray-500 mb-3 text-center">
                                        Product Image
                                    </label>
                                    <div className="flex justify-center">
                                        {editFields.image ? (
                                            <div className="relative w-48 h-48 rounded-xl overflow-hidden group">
                                                <img
                                                    src={editFields.image}
                                                    alt="Product preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    onClick={() => setEditFields(f => ({ ...f, image: "" }))}
                                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                >
                                                    <X size={24} className="text-white" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="edit-product-image"
                                                className="w-48 h-48 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-300 transition-colors bg-gray-50"
                                            >
                                                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                                                    <Upload size={20} className="text-orange-400" />
                                                </div>
                                                <span className="text-sm text-gray-400">Upload Image</span>
                                                <span className="text-xs text-gray-300">JPG, PNG, GIF up to 5MB</span>
                                                <input
                                                    type="file"
                                                    id="edit-product-image"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Divider */}
                                <hr className="border-gray-100" />

                                {/* Product Name + Price */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                                            Product Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editFields.name}
                                            onChange={(e) => setEditFields(f => ({ ...f, name: e.target.value }))}
                                            placeholder="e.g. Grilled Bangus"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                                            Price
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₱</span>
                                            <input
                                                type="number"
                                                value={editFields.price}
                                                onChange={(e) => setEditFields(f => ({ ...f, price: e.target.value }))}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                className="w-full pl-7 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Selection - Card Style */}
                                <div>
                                    <label className="block text-xs uppercase tracking-wide text-gray-500 mb-3">
                                        Category
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`p-3 rounded-xl border-2 transition-all text-left ${
                                                    selectedCategory === cat.id
                                                        ? "border-orange-500 bg-orange-50"
                                                        : "border-gray-200 bg-white hover:border-orange-300"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                        selectedCategory === cat.id ? "border-orange-500" : "border-gray-300"
                                                    }`}>
                                                        <div className={`w-2 h-2 rounded-full bg-orange-500 transition-opacity ${
                                                            selectedCategory === cat.id ? "opacity-100" : "opacity-0"
                                                        }`} />
                                                    </div>
                                                    <span className={`text-sm font-medium ${
                                                        selectedCategory === cat.id ? "text-orange-700" : "text-gray-700"
                                                    }`}>
                                                        {cat.name}
                                                    </span>
                                                </div>
                                                {selectedCategory === cat.id && (
                                                    <p className="text-xs text-orange-500 mt-1 ml-6">
                                                        Selected category
                                                    </p>
                                                )}
                                            </button>
                                        ))}
                                        {categories.length === 0 && (
                                            <p className="text-sm text-gray-400 col-span-2 text-center py-4">
                                                No categories available.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={editFields.description}
                                        onChange={(e) => setEditFields(f => ({ ...f, description: e.target.value }))}
                                        placeholder="Short description of the item"
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => onOpenChange(false)}
                                        className="flex-1 py-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => onSave(selectedCategory)}
                                        disabled={isLoading}
                                        className="flex-1 py-4 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50"
                                        style={{ background: "#FF6B35" }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = "#E55A2B"}
                                        onMouseLeave={(e) => e.currentTarget.style.background = "#FF6B35"}
                                    >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
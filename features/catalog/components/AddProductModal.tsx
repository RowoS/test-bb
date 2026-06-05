"use client";

import { useState } from "react";
import { X, Upload} from "lucide-react";
import {  ProductFormModalProps } from "../types/types";


export default function ProductFormModal({ open, onOpenChange, categories, onSubmit, isLoading }: ProductFormModalProps) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<string>("");
    const [fieldError, setFieldError] = useState("");

    if (!open) return null;

    const handleClose = () => {
        setSelectedCategories([]);
        setName("");
        setDescription("");
        setPrice("");
        setImage("");
        setFieldError("");
        onOpenChange(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(c => c !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSubmit = async () => {
        if (!name.trim()) { setFieldError("Product name is required"); return; }
        if (!price || isNaN(Number(price)) || Number(price) <= 0) { setFieldError("Enter a valid price"); return; }
        if (selectedCategories.length === 0) { setFieldError("Select at least one category"); return; }
        setFieldError("");

        // Submit for each selected category, primary is first
        await onSubmit(selectedCategories[0], {
            name: name.trim(),
            description: description.trim() || undefined,
            price: Number(price),
            image: image || undefined,
        });

        handleClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Add New Product</h2>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    {fieldError && <p className="text-red-500 text-sm mb-4">{fieldError}</p>}

                    <div className="space-y-6">
                        {/* Image Upload - Single Centered */}
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-3 text-center">
                                Product Image
                            </label>
                            <div className="flex justify-center">
                                {image ? (
                                    <div className="relative w-48 h-48 rounded-xl overflow-hidden group">
                                        <img
                                            src={image}
                                            alt="Product preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => setImage("")}
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                        >
                                            <X size={24} className="text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="product-image"
                                        className="w-48 h-48 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-orange-300 transition-colors bg-gray-50"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                                            <Upload size={20} className="text-orange-400" />
                                        </div>
                                        <span className="text-sm text-gray-400">Upload Image</span>
                                        <span className="text-xs text-gray-300">JPG, PNG, GIF up to 5MB</span>
                                        <input
                                            type="file"
                                            id="product-image"
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
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Grilled Bangus"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="₱0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-3">
                                Category
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {categories.map((cat) => (
                                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat.id)}
                                                onChange={() => handleCategoryToggle(cat.id)}
                                                className="sr-only"
                                            />
                                            <div
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                                    selectedCategories.includes(cat.id)
                                                        ? "border-orange-500 bg-orange-50"
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                {selectedCategories.includes(cat.id) && (
                                                    <svg className="w-3 h-3 text-orange-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-700">{cat.name}</span>
                                    </label>
                                ))}
                                {categories.length === 0 && (
                                    <p className="text-sm text-gray-400">No categories yet. Add one first.</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Short description of the item"
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <div className="pt-2">
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold uppercase tracking-wide transition-colors"
                            >
                                {isLoading ? "Adding..." : "Add Product"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
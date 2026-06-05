"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {AddCategoryModalProps} from "../types/types";

export default function AddCategoryModal({ open, onOpenChange, onSubmit, isLoading }: AddCategoryModalProps) {
    const [name, setName] = useState("");
    const [fieldError, setFieldError] = useState("");

    if (!open) return null;

    const handleClose = () => {
        setName("");
        setFieldError("");
        onOpenChange(false);
    };

    const handleSubmit = async () => {
        if (!name.trim()) { setFieldError("Category name is required"); return; }
        setFieldError("");
        await onSubmit(name.trim());
        handleClose();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-sm p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Add New Category</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {fieldError && <p className="text-red-500 text-sm mb-4">{fieldError}</p>}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="e.g. Beverages"
                        autoFocus
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
                    >
                        {isLoading ? "Adding..." : "Add Category"}
                    </button>
                </div>
            </div>
        </div>
    );
}
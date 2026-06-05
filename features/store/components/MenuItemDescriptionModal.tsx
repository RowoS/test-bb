import { MenuItem } from "../types/types";
import { X } from "lucide-react";

export function DescriptionModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
                <div
                    className="bg-white rounded-2xl p-8 max-w-xl w-full mx-4 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative mb-4">
                        <h3 className="font-semibold text-gray-900 text-lg text-center">
                            {item.name}
                        </h3>

                        <button
                            onClick={onClose}
                            className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {item.image && (
                        <>
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-32 h-32 object-cover rounded-lg mx-auto mb-3"
                            />
                            <div className="border-b border-gray-200 mb-3" />
                        </>
                    )}

                    <p className="text-sm text-gray-600 leading-relaxed pb-3">
                        {item.description || "No description available."}
                    </p>

                    <div className="border-t border-gray-200 mt-3 pt-5 flex justify-center">
                        <p className="text-orange-500 font-semibold">
                            ₱{item.price.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        );
    }
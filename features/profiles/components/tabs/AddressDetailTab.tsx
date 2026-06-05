"use client";

import { MapPin, Plus, Trash2, Map, X, Loader2, Search } from "lucide-react";
import { useAddresses } from "../../hooks/useAddresses";
import MapOverlay from "@/features/maps/MapOverLay";

export default function AddressDetailTab() {
    const {values, functions} = useAddresses();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Your Addresses</h3>
                {!values.isAdding && (
                    <button
                        onClick={() => functions.setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
                    >
                        <Plus size={16} />
                        Add Address
                    </button>
                )}
            </div>

            {values.error && (
                <p className="text-red-400 text-sm">{values.error}</p>
            )}

            {values.isAdding && (
                <div className="bg-[#1D1D1D] rounded-xl p-5 space-y-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium">New Address</h4>
                        <button onClick={functions.handleCancelAdd} className="text-gray-400 hover:text-white transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Landmark */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">
                            Landmark / Purok / Street <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={values.form.landmark}
                            onChange={(e) => functions.setForm(prev => ({ ...prev, landmark: e.target.value }))}
                            placeholder="e.g. Purok 3, near the church"
                            className="w-full px-4 py-2.5 bg-[#2D2D2D] border border-gray-600 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">
                            Barangay <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={values.barangaySearch || values.form.barangay}
                                onChange={(e) => {
                                    functions.setBarangaySearch(e.target.value);
                                    functions.setForm(prev => ({ ...prev, barangay: "" }));
                                }}
                                placeholder="Search barangay..."
                                className="w-full pl-8 pr-4 py-2.5 bg-[#2D2D2D] border border-gray-600 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>

                        {/* Dropdown list — shows when searching and no barangay selected yet */}
                        {values.barangaySearch && !values.form.barangay && values.barangays.length > 0 && (
                            <ul className="mt-1 bg-[#2D2D2D] border border-gray-600 rounded-lg overflow-hidden max-h-44 overflow-y-auto">
                                {values.barangays.map(b => (
                                    <li key={b.id}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                functions.setForm(prev => ({ ...prev, barangay: b.barangay }));
                                                functions.setBarangaySearch("");
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#3D3D3D] transition-colors"
                                        >
                                            {b.barangay}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {values.barangaySearch && !values.form.barangay && values.barangays.length === 0 && (
                            <p className="mt-1 text-xs text-gray-500 px-1">No barangay found</p>
                        )}
                    </div>


                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">City</label>
                        <input
                            type="text"
                            disabled
                            value="Baybay"
                            className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-gray-700 rounded-lg text-gray-500 text-sm cursor-not-allowed"
                        />
                    </div>


                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">
                            Pin Location <span className="text-red-400">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => functions.setShowMapOverlay(true)}
                            className={`w-full px-4 py-3 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 text-sm transition-colors ${
                                values.form.latitude && values.form.longitude
                                    ? "border-orange-500 text-orange-400 bg-orange-500/10"
                                    : "border-gray-600 text-gray-400 hover:border-orange-500 hover:text-orange-400"
                            }`}
                        >
                            <Map size={18} />
                            {values.form.latitude && values.form.longitude
                                ? `Pinned: ${values.form.latitude.toFixed(5)}, ${values.form.longitude.toFixed(5)}`
                                : "Open Map to Pin Location"}
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-1">
                        <button
                            onClick={functions.handleCancelAdd}
                            className="px-4 py-2 bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white rounded-lg text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={functions.handleAddAddress}
                            disabled={values.isSaving}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                        >
                            {values.isSaving && <Loader2 size={14} className="animate-spin" />}
                            {values.isSaving ? "Saving..." : "Save Address"}
                        </button>
                    </div>
                </div>
            )}

            {/* Address list */}
            {values.isLoading ? (
                <div className="flex items-center justify-center py-10">
                    <Loader2 size={24} className="animate-spin text-gray-500" />
                </div>
            ) : values.addresses.length === 0 && !values.isAdding ? (
                <div className="text-center py-10">
                    <MapPin size={36} className="text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No addresses saved yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {values.addresses.map(address => (
                        <div
                            key={address.id}
                            className="border border-gray-700 rounded-xl p-4 flex items-start justify-between hover:border-orange-500/50 transition-colors bg-[#1D1D1D]"
                        >
                            <div className="flex gap-3">
                                <MapPin size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-white text-sm font-medium">{address.landmark}</p>
                                    <p className="text-gray-400 text-xs mt-0.5">
                                        {address.barangay}, {address.city}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => functions.handleDeleteAddress(address.id)}
                                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Map overlay */}
            {values.showMapOverlay && (
                <MapOverlay
                    onClose={() => functions.setShowMapOverlay(false)}
                    onConfirm={(confirmed) => {
                        functions.handleMapConfirm(
                            confirmed.geolocation.latitude,
                            confirmed.geolocation.longitude
                        );
                    }}
                />
            )}
        </div>
    );
}

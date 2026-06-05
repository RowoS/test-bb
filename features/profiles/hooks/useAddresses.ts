"use client";

import { useState, useEffect } from "react";
import { Address, Barangay, NewAddress, EMPTY_FORM } from "../types/types";
import {getAddresses, insertAddress, deleteAddress, getBarangays,} from "../libs/address-actions";


export function useAddresses() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [barangays, setBarangays] = useState<Barangay[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isAdding, setIsAdding] = useState(false);
    const [form, setForm] = useState<NewAddress>(EMPTY_FORM);
    const [barangaySearch, setBarangaySearch] = useState("");
    const [showMapOverlay, setShowMapOverlay] = useState(false);

    useEffect(() => {
        Promise.all([fetchAddresses(), fetchBarangays()]);
    }, []);

    const fetchAddresses = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAddresses();
            setAddresses(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load addresses");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBarangays = async () => {
        try {
            const data = await getBarangays();
            setBarangays(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load barangays");
        }
    };

    const handleAddAddress = async () => {
        if (!form.landmark.trim()) {
            setError("Landmark/Street is required.");
            return;
        }
        if (!form.barangay) {
            setError("Please select a barangay.");
            return;
        }
        if (!form.latitude || !form.longitude) {
            setError("Please pin your location on the map.");
            return;
        }

        setIsSaving(true);
        setError(null);
        try {
            const inserted = await insertAddress(form);
            setAddresses(prev => [...prev, inserted]);
            setForm(EMPTY_FORM);
            setBarangaySearch("");
            setIsAdding(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save address");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        try {
            await deleteAddress(id);
            setAddresses(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete address");
        }
    };

    const handleMapConfirm = (latitude: number, longitude: number) => {
        setForm(prev => ({ ...prev, latitude, longitude }));
        setShowMapOverlay(false);
    };

    const handleCancelAdd = () => {
        setForm(EMPTY_FORM);
        setBarangaySearch("");
        setError(null);
        setIsAdding(false);
    };

    const filteredBarangays = barangays.filter(b =>
        b.barangay.toLowerCase().includes(barangaySearch.toLowerCase())
    );

    return {
        values: {addresses, barangays: filteredBarangays, isLoading, isSaving,error,isAdding,form,barangaySearch,showMapOverlay},
        functions: {setIsAdding, setForm, setBarangaySearch, setShowMapOverlay, handleAddAddress, handleDeleteAddress, handleMapConfirm, handleCancelAdd},
    };
}

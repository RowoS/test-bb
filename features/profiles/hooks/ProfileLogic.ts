"use client";
import { useRouter } from "next/navigation";
import { useAsyncForm } from "@/features/shared/hooks/useAsyncForm";
import {UpdateUserPassword, Verify2FA, Enroll2FA, resetUnverifiedMFA, getMFAStatus, disableMFA, updateStoreInfo} from "../libs/profile-actions";
import { getStoreInfo } from "../libs/profile-queries";
import { useState, useEffect } from "react";
import { ConfirmedLocation } from "@/features/maps/types/types";
import { StoreInfo } from "../types/types";


export function useProfile() {
    const Router = useRouter();
    const { isLoading, error, success, setError, setSuccess, run } = useAsyncForm();

    const [factorId, setFactorId] = useState<string | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [storeLocation, setStoreLocation] = useState<ConfirmedLocation | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [verifiedFactorId, setVerifiedFactorId] = useState<string | null>(null);

    getMFAStatus()
        .then(({ isEnabled, factorId }) => {
            setMfaEnabled(isEnabled);
            setVerifiedFactorId(factorId);
        })
    .catch(() => setError("Failed to check 2FA status"));

    useEffect(() => {
        getStoreInfo()
            .then((data) => setStoreInfo(data))
            .catch(() => setError("Failed to load store information"));

        resetUnverifiedMFA()
            .then((result) => {
                if (result) {
                    setQrCodeUrl(result.qrCodeUrl);
                    setFactorId(result.factorId);
                }
            })
            .catch(() => setError("Failed to check 2FA status"));
    }, []);


    const showMapOverlay = (IsOpen: boolean) => {
        setShowMap(IsOpen);
    };

    //setters for form fields and actions
    const handleLocationConfirm = (location: ConfirmedLocation) => {
        setStoreLocation(location);
        setStoreInfo(prev => prev ? { 
            ...prev, 
            address: location.address, 
            longitude: location.geolocation.longitude, 
            latitude: location.geolocation.latitude 
        } : prev);
        setShowMap(false);
    };

    const handleLogoUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setStoreInfo(prev => prev ? { ...prev, store_logo: url } : prev);
    };

    const handleDescriptionChange = (newDescription: string) => {
        setStoreInfo(prev => prev ? { ...prev, store_description: newDescription } : prev);
    }

    const handleStoreNameChange = (newName: string) => {
        setStoreInfo(prev => prev ? { ...prev, store_name: newName } : prev);
    }

    const handleLogoRemove = () => {
        setStoreInfo(prev => prev ? { ...prev, store_logo: null } : prev);
    };

    const handlePhoneChange = (index: number, value: string) => {
        setStoreInfo(prev => {
        if (!prev) return prev;
        const updated = [...(prev.phone_numbers ?? [])];
        updated[index] = value;
        return { ...prev, phone_numbers: updated };
        });
    };

    const handlePhoneRemove = (index: number) => {
        setStoreInfo(prev => {
        if (!prev) return prev;
        const updated = (prev.phone_numbers ?? []).filter((_, i) => i !== index);
        return { ...prev, phone_numbers: updated };
        });
    };

    const handleAccountChange = (index: number, value: string) => {
        setStoreInfo(prev => {
        if (!prev) return prev;
        const updated = [...(prev.connected_accounts ?? [])];
        updated[index] = value;
        return { ...prev, connected_accounts: updated };
        });
    };


    const handleOpeningTimeChange = (value: string) => {
        setStoreInfo(prev => prev ? { ...prev, opening_time: value } : prev);
    };

    const handleClosingTimeChange = (value: string) => {
        setStoreInfo(prev => prev ? { ...prev, closing_time: value } : prev);
    };

    const handleAccountRemove = (index: number) => {
        setStoreInfo(prev => {
        if (!prev) return prev;
        const updated = (prev.connected_accounts ?? []).filter((_, i) => i !== index);
        return { ...prev, connected_accounts: updated };
        });
    };

    const handleAddPhone = () => {
        setStoreInfo(prev => prev
        ? { ...prev, phone_numbers: [...(prev.phone_numbers ?? []), ""] }
        : prev
        );
    };

    //security actions
    const handleUpdatePassword = async (newPassword: string) => {
        await run(async () => {
            await UpdateUserPassword(newPassword);
        });

        setSuccess("Password updated successfully!");
    };

    //
    const handleEnroll2FA = async () => {
        await run(async () => {
            const { qrCodeUrl, secret, factorId } = await Enroll2FA();
            setQrCodeUrl(qrCodeUrl);
            setFactorId(factorId);
        });
    };

    const handleVerify2FA = async (userInputtedCode: string) => {
        if (!factorId) {
            setError("No 2FA enrollment in progress");
            return;
        }
        await run(async () => {
            await Verify2FA(factorId, userInputtedCode);
            setSuccess("2FA setup complete!");
            setFactorId(null);
            setQrCodeUrl(null);
        });
    };

    const handleDisable2FA = async () => {
        if (!verifiedFactorId) return;
        await run(async () => {
            await disableMFA(verifiedFactorId);
            setMfaEnabled(false);
            setVerifiedFactorId(null);
            setSuccess("2FA has been disabled.");
        });
    };

    const handleDeliveryOptionChange = (value: "Pick-up" | "Food-Delivery" | "both") => {
        setStoreInfo(prev => prev ? { ...prev, delivery_options: value } : prev);
    };

    const SaveChanges = async () => {
        if (!storeInfo?.id) return;
        await run(async () => {
            await updateStoreInfo({
                id: storeInfo.id,
                store_name: storeInfo.store_name,
                store_description: storeInfo.store_description ?? undefined,
                store_logo: storeInfo.store_logo ?? null,
                address: storeInfo.address ?? undefined,
                phone_numbers: storeInfo.phone_numbers ?? undefined,
                connected_accounts: storeInfo.connected_accounts ?? undefined,
                delivery_options: storeInfo.delivery_options ?? undefined,
                closing_time: storeInfo.closing_time?? undefined,
                opening_time: storeInfo.opening_time?? undefined,
                ...(storeLocation && {
                    latitude: storeLocation.geolocation.latitude,
                    longitude: storeLocation.geolocation.longitude,
                })
            });
            setSuccess("Store information updated successfully!");
        });
    };

    return {
        values: {isLoading, error, success, qrCodeUrl, factorId, storeInfo, storeLocation, showMap, mfaEnabled, verifiedFactorId},
        functions: {setError, setSuccess, showMapOverlay, handleLocationConfirm, handlePhoneChange, 
            handlePhoneRemove, handleAddPhone, handleAccountChange, 
            handleAccountRemove, handleDescriptionChange, handleStoreNameChange, handleLogoUpdate, 
            handleLogoRemove, handleUpdatePassword, handleEnroll2FA, handleVerify2FA, handleDisable2FA,
            handleDeliveryOptionChange,handleClosingTimeChange, handleOpeningTimeChange, SaveChanges}
    };
}
"use client";

import * as Dialog from '@radix-ui/react-dialog';
import { X, MapPin, Minus, Plus, Trash2, Bike, ShoppingBag, ArrowLeft, Loader2, Banknote, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { CartItem, MenuItem } from '../types/types';
import { useAddresses } from '@/features/profiles/hooks/useAddresses';
import { placeOrder } from '../libs/cart-actions'; // adjust path
import { useRouter } from 'next/navigation';

interface StoreCheckoutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    storeId: string;
    storeName: string;
    cartId: string;
    items: CartItem[];
    subtotal: number;
    onUpdateQty: (cartItemId: string, qty: number) => void;
    onRemoveItem: (cartItemId: string) => void;
}

const DELIVERY_FEE = 49;
const STEP_LABELS = ["Order", "Method", "Payment"];

type Fulfillment = "pickup" | "delivery";

export function StoreCheckoutModal({
    open, onOpenChange,
    storeId, storeName, cartId,
    items, subtotal,
    onUpdateQty, onRemoveItem,
}: StoreCheckoutModalProps) {
    const router = useRouter();
    const { values: { addresses } } = useAddresses();

    const [step, setStep] = useState(1);
    const [fulfillment, setFulfillment] = useState<Fulfillment | null>(null);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [notes, setNotes] = useState("");
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [isChangingAddress, setIsChangingAddress] = useState(false);
    const [isPlacing, setIsPlacing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isDelivery = fulfillment === "delivery";
    const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;
    const selectedAddress = addresses.find(a => a.id === selectedAddressId) ?? addresses[0] ?? null;

    const goNext = () => setStep(s => Math.min(s + 1, 3));
    const goBack = () => {
        if (step === 1) { onOpenChange(false); return; }
        setStep(s => s - 1);
    };

    const handleConfirm = async () => {
        if (!fulfillment || !cartId) return;
        setIsPlacing(true);
        setError(null);
        try {
            const { order_id } = await placeOrder({
                store_id: storeId,
                cart_id: cartId,
                fulfillment,
                subtotal,
                delivery_fee: deliveryFee,
                total,
                notes: notes || undefined,
                delivery_address_id: isDelivery ? (selectedAddress?.id ?? null) : null,
                delivery_landmark: isDelivery ? (selectedAddress?.landmark ?? null) : null,
                delivery_barangay: isDelivery ? (selectedAddress?.barangay ?? null) : null,
                delivery_city: isDelivery ? (selectedAddress?.city ?? null) : null,
                delivery_latitude: null,
                delivery_longitude: null,
                items: items.map(i => ({
                    item_id: i.item_id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    image: i.image,
                })),
            });
            onOpenChange(false);
            router.push("/customer?tab=delivery");
        } catch (err: any) {
            setError(err.message ?? "Something went wrong.");
        } finally {
            setIsPlacing(false);
        }
    };

    const OrderSummary = () => (
        <div className="flex-1 border border-gray-100 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-900 mb-3">Order Summary</p>
            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate mr-2">{item.name} x{item.quantity}</span>
                        <span className="text-gray-900 flex-shrink-0">₱{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span>{isDelivery ? `₱${deliveryFee.toFixed(2)}` : "₱0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Other Charges</span>
                    <span>₱0.00</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
                    <span>TOTAL:</span>
                    <span>₱{total.toFixed(2)}</span>
                </div>
                <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="flex items-center gap-1 text-xs text-gray-400 mt-1"
                >
                    Breakdown {showBreakdown ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {showBreakdown && (
                    <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between text-xs text-gray-500">
                                <span>{item.name} x{item.quantity}</span>
                                <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        {isDelivery && (
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Delivery Fee</span>
                                <span>₱{deliveryFee.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[70]" />
                <Dialog.Content
                    className="fixed inset-0 z-[80] flex items-center justify-center p-4"
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto">
                        <div className="p-6">

                            {/* Step dots */}
                            <div className="flex items-center justify-center gap-2 mb-5">
                                {STEP_LABELS.map((_, i) => {
                                    const s = i + 1;
                                    return (
                                        <div key={s} className={`rounded-full transition-all duration-300 ${
                                            s === step ? "w-6 h-3 bg-orange-500"
                                            : s < step ? "w-3 h-3 bg-orange-400/60"
                                            : "w-3 h-3 bg-gray-200"
                                        }`} />
                                    );
                                })}
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                                <button onClick={goBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-orange-500 transition-colors">
                                    <ArrowLeft size={18} />
                                </button>
                                <Dialog.Title className="text-base font-semibold text-gray-900">
                                    {step === 1 && storeName}
                                    {step === 2 && "Choose Method of Order"}
                                    {step === 3 && "Mode of Payment"}
                                </Dialog.Title>
                                <button onClick={() => onOpenChange(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Step 1 — Order review */}
                            {step === 1 && (
                                <div className="space-y-4 mb-6">
                                    {items.map(item => (
                                        <div key={item.id} className="flex gap-4 items-start">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                                            ) : (
                                                <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-gray-300 font-bold text-2xl">{item.name.charAt(0)}</span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">₱{item.price.toFixed(2)}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => item.quantity === 1 ? onRemoveItem(item.id) : onUpdateQty(item.id, item.quantity - 1)}
                                                        className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                                                    >
                                                        {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                                                    </button>
                                                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add a note to your order (optional)"
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none mt-2"
                                    />
                                </div>
                            )}

                            {/* Step 2 — Fulfillment method */}
                            {step === 2 && (
                                <div className="py-4 mb-6">
                                    <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                                        {(["pickup", "delivery"] as Fulfillment[]).map(method => (
                                            <button
                                                key={method}
                                                onClick={() => setFulfillment(method)}
                                                className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all ${
                                                    fulfillment === method
                                                        ? "border-orange-500 bg-orange-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                                                    {method === "pickup"
                                                        ? <ShoppingBag size={28} className="text-gray-500" />
                                                        : <Bike size={28} className="text-gray-500" />
                                                    }
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 capitalize">
                                                    {method === "pickup" ? "Pickup Point" : "Delivery"}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3 — Payment + address */}
                            {step === 3 && (
                                <div className="flex gap-6 mb-6">
                                    <div className="flex-1 space-y-5">
                                        {/* Payment methods */}
                                        <div>
                                            <p className="text-xs text-gray-500 mb-3">Select Payment Method</p>
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-orange-500 bg-orange-50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                            <Banknote size={20} className="text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                                                            <p className="text-xs text-gray-500">Pay when you receive your order</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {["Mastercard", "GCash"].map(label => (
                                                    <div key={label} className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 opacity-50 cursor-not-allowed">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                                <span className="text-xs font-bold">{label.slice(0, 2)}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{label}</p>
                                                                <p className="text-xs text-gray-500">Coming soon</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Delivery address */}
                                        {isDelivery && (
                                            <div>
                                                {isChangingAddress ? (
                                                    <div className="border border-gray-100 rounded-xl p-4">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <p className="text-sm font-semibold text-gray-900">Select Address</p>
                                                            <button onClick={() => setIsChangingAddress(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {addresses.length === 0 ? (
                                                                <p className="text-xs text-red-400">No saved addresses. Add one in your profile.</p>
                                                            ) : addresses.map(address => (
                                                                <button
                                                                    key={address.id}
                                                                    onClick={() => { setSelectedAddressId(address.id); setIsChangingAddress(false); }}
                                                                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                                                                        selectedAddress?.id === address.id
                                                                            ? "border-orange-500 bg-orange-50"
                                                                            : "border-gray-200 hover:border-gray-300"
                                                                    }`}
                                                                >
                                                                    <MapPin size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-900">{address.landmark}</p>
                                                                        <p className="text-xs text-gray-400">{address.barangay}, {address.city}</p>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-xs text-gray-500">Delivery Address</p>
                                                            <button onClick={() => setIsChangingAddress(true)} className="text-xs text-orange-500 hover:underline">Change</button>
                                                        </div>
                                                        {selectedAddress ? (
                                                            <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg border border-orange-500 bg-orange-50">
                                                                <MapPin size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{selectedAddress.landmark}</p>
                                                                    <p className="text-xs text-gray-400">{selectedAddress.barangay}, {selectedAddress.city}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-red-400">No saved addresses. Add one in your profile.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <OrderSummary />
                                </div>
                            )}

                            {/* Totals for steps 1 & 2 */}
                            {step !== 3 && (
                                <div className="border-t border-gray-100 pt-4 mt-4 space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>₱{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span>{isDelivery ? `₱${deliveryFee.toFixed(2)}` : "₱0.00"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Other Charges</span>
                                        <span>₱0.00</span>
                                    </div>
                                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2">
                                        <span>TOTAL:</span>
                                        <span>₱{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Error */}
                            {error && <p className="text-xs text-red-500 mt-3 text-center">{error}</p>}

                            {/* Action buttons */}
                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <button
                                    onClick={goBack}
                                    className="px-4 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 font-medium text-sm transition-colors"
                                >
                                    {step === 1 ? "Back to Cart" : "Back"}
                                </button>
                                <button
                                    onClick={step === 3 ? handleConfirm : goNext}
                                    disabled={(step === 2 && !fulfillment) || isPlacing}
                                    className="px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    {isPlacing && <Loader2 size={14} className="animate-spin" />}
                                    {step === 3 ? "Place Order" : "Confirm"}
                                </button>
                            </div>

                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
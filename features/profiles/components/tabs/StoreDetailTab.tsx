import { User, Plus, X, Link2} from 'lucide-react';
import { StoreDetailsTabProps, DeliveryOption } from '../../types/types';
import { getBrandIcon } from "../../libs/brand-icons";

const deliveryOptions: { value: DeliveryOption; label: string }[] = [
    { value: "Pick-up",       label: "Pick-up" },
    { value: "Food-Delivery", label: "Food Delivery" },
    { value: "both",          label: "Both" },
];


export default function StoreDetailsTab({ storeInfo, onUpdateLocation, onAddPhone, onPhoneChange, onPhoneRemove , onAccountChange, onAccountRemove, onDeliveryOptionChange}: StoreDetailsTabProps) {
    return (
        <>
            <div>
                <h3 className="text-white mb-3">Store logo</h3>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                        {storeInfo?.store_logo
                            ? <img src={storeInfo.store_logo} alt="Store Logo" className="w-full h-full object-cover" />
                            : <User className="w-8 h-8 text-gray-600" />
                        }
                    </div>
                    <button className="bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white px-4 py-2 rounded-lg transition-colors">
                        Update
                    </button>
                    <button className="text-red-400 hover:text-red-300 px-4 py-2 transition-colors">
                        Remove
                    </button>
                </div>

                <div className="pt-5">
                    <h3 className="text-white mb-3">Store location</h3>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-gray-300">{storeInfo?.address ?? "No address set"}</span>
                    </div>
                    <button onClick={onUpdateLocation} className="bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white px-4 py-2 rounded-lg transition-colors">
                        Update Store Location
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-white mb-3">Delivery options</h3>
                <div className="flex items-center gap-3">
                    {deliveryOptions.map(option => {
                        const isSelected = storeInfo?.delivery_options === option.value;
                        return (
                            <button
                                key={option.value}
                                onClick={() => onDeliveryOptionChange(option.value)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors text-sm font-medium ${
                                    isSelected
                                        ? "bg-purple-600 border-purple-600 text-white"
                                        : "bg-transparent border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-300"
                                }`}
                            >
                                <div className={`w-2.5 h-2.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                    isSelected ? "border-white" : "border-gray-500"
                                }`}>
                                    {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                                </div>
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Phone Numbers */}
            <div>
                <h3 className="text-white mb-3">Phone number</h3>
                {storeInfo?.phone_numbers?.map((number, i) => (
                    <div key={i} className="flex items-center gap-3 mb-2">
                    <input
                        value={number}
                        onChange={(e) => onPhoneChange(i, e.target.value)}
                        className="bg-[#1D1D1D] text-gray-300 px-3 py-1.5 rounded-lg text-sm w-48 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    {i === 0 && <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">Primary</span>}
                    <button onClick={() => onPhoneRemove(i)} className="text-red-400 hover:text-red-300 text-xs">Remove</button>
                    </div>
                ))}
                <button onClick={onAddPhone} className="text-gray-400 hover:text-gray-300 flex items-center gap-2 text-sm mt-2">
                    <Plus className="w-4 h-4" /> Add phone number
                </button>
            </div>

            {/* Connected Accounts */}
            <div>
                <h3 className="text-white mb-3">Connected Accounts</h3>
                {storeInfo?.connected_accounts?.length
                    ? storeInfo.connected_accounts.map((account, i) => (
                        <div key={i} className="flex items-center gap-3 mb-2">
                            {getBrandIcon(account)}
                            <input
                                value={account}
                                onChange={(e) => onAccountChange(i, e.target.value)}
                                placeholder="https://..."
                                className="bg-[#1D1D1D] text-gray-300 px-3 py-1.5 rounded-lg text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />

                            <a
                                href={account}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-xs text-purple-400 hover:underline ${!account.startsWith("http") ? "pointer-events-none opacity-40" : ""}`}
                            >
                                <span className="text-gray-300">{account}</span>
                            </a>
                            <button onClick={() => onAccountRemove(i)} className="text-red-400 hover:text-red-300">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                    : <span className="text-gray-400 text-sm">No connected accounts</span>
                }
                <button onClick={() => onAccountChange(storeInfo?.connected_accounts?.length ?? 0, "")} className="text-gray-400 hover:text-gray-300 flex items-center gap-2 text-sm mt-2">
                    <Plus className="w-4 h-4" /> Add link
                </button>
            </div>
        </>
    );
}
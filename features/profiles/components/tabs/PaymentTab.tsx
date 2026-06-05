import { Settings } from "lucide-react";


export default function PaymentTab() {
    return(
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-[#3D3D3D] flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm">Payment settings coming soon.</p>
        </div>
    )
}
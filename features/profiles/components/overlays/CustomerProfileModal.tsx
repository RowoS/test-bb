import { useState } from "react";
import TabBar from "../shared/TabBar";
import AddressDetailTab from "../tabs/AddressDetailTab";
import SecurityTab from "../tabs/SecurityDetailTab";
import PaymentsTab from "../tabs/PaymentTab";
import { ProfileOverlayProps } from "../../types/types";


const TABS = ["Addresses", "Security", "Payments"];

export default function CustomerProfileOverlay({onClose }: ProfileOverlayProps) {
  const [activeTab, setActiveTab] = useState("Addresses");

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] pt-4">
        <div className="bg-[#2D2D2D] rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-auto">

          <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="px-8 py-6 space-y-6">
            {activeTab === "Addresses" && (
              <AddressDetailTab/>
            )}
            {activeTab === "Security" && <SecurityTab />}
            {activeTab === "Payments" && <PaymentsTab />}

            <div className="border-t border-gray-700 pt-6 flex justify-end items-center gap-3">
              <button 
                onClick={onClose} 
                className="px-6 py-2 bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>     
    </>
  );
}
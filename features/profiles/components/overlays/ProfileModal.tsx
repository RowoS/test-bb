import { useState } from "react";
import TabBar from "../shared/TabBar";
import { ProfileDetails } from "../shared/ProfileDescription";
import { useProfile } from "@/features/profiles/hooks/ProfileLogic";
import StoreDetailsTab from "../tabs/StoreDetailTab";
import SecurityTab from "../tabs/SecurityDetailTab";
import PaymentsTab from "../tabs/PaymentTab";
import MapOverlay from "@/features/maps/MapOverLay";
import { ProfileOverlayProps } from "../../types/types";


const TABS = ["Store Details", "Security", "Payments"];

export default function ProfileOverlay({onClose }: ProfileOverlayProps) {
  const [activeTab, setActiveTab] = useState("Store Details");
  const { values, functions,} = useProfile();
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#2D2D2D] rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-auto">
          <ProfileDetails
            accountName={values.storeInfo?.store_name ?? "Loading..."}
            description={values.storeInfo?.store_description?? ""}
            openingTime={values.storeInfo?.opening_time}
            closingTime={values.storeInfo?.closing_time}
            onAccountNameChange={functions.handleStoreNameChange}
            onDescriptionChange={functions.handleDescriptionChange}
            onOpeningTimeChange={functions.handleOpeningTimeChange}
            onClosingTimeChange={functions.handleClosingTimeChange}
          />
          <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="px-8 py-6 space-y-6">
            {activeTab === "Store Details" && (
              <StoreDetailsTab
                storeInfo={values.storeInfo}
                onUpdateLocation={() => functions.showMapOverlay(true)}
                onPhoneChange={functions.handlePhoneChange}
                onPhoneRemove={functions.handlePhoneRemove}
                onAddPhone={functions.handleAddPhone}
                onAccountChange={functions.handleAccountChange}
                onAccountRemove={functions.handleAccountRemove}
                onDeliveryOptionChange={functions.handleDeliveryOptionChange}
              />
            )}
            {values.showMap && (<MapOverlay 
              onClose={() => functions.showMapOverlay(false)} 
              onConfirm={(location) => {functions.handleLocationConfirm(location)}} />)}
            {activeTab === "Security" && <SecurityTab />}
            {activeTab === "Payments" && <PaymentsTab />}

            <div className="border-t border-gray-700 pt-6 flex justify-end items-center gap-3">
              {values.error && (
                <p className="text-red-400 text-sm mr-auto">{values.error}</p>
              )}
              {values.success && (
                <p className="text-green-400 text-sm mr-auto">✓ {values.success}</p>
              )}

              <button 
                onClick={onClose} 
                className="px-6 py-2 bg-[#3D3D3D] hover:bg-[#4D4D4D] text-white rounded-lg"
              >
                Close
              </button>

              <button 
                onClick={functions.SaveChanges} 
                disabled={values.isLoading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                {values.isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Saving...
                  </>
                ) : "Save changes"}
              </button>
            </div>

            
          </div>
        </div>
      </div>     
    </>
  );
}
"use client";

import { ShoppingBag, Upload, X, MapPin, Phone, Mail, Clock, Store, Map} from 'lucide-react';
import { useSetUpFormLogic } from '../../hooks/SetUpFormLogic';
import MapOverlay from '@/features/maps/MapOverLay';
import { StoreSetupProps } from '../../types/types';


export default function StoreSetup({ onComplete, onSkip,userId }: StoreSetupProps) {
  
  const {
    state: { currentStep, formData, logoPreview, logoInputRef, isLoading, error, showMap },
    setters: { handleChange, handleImageChange, clearLogo, handleNext, handleBack, handleMapSelect, handleDeliveryOptionChange },
  } = useSetUpFormLogic({ userId, onComplete });
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1D3557] to-[#2D4567] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">

        {/* Header */}
        <div className="bg-[#FF6B35] px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Welcome to Buybites!</h1>
                <p className="text-white/90 text-sm">Let's set up your store profile</p>
              </div>
            </div>
            {onSkip && (
              <button onClick={onSkip} className="text-white hover:text-white/80 transition-colors">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of 2</span>
            <span className="text-sm text-gray-500">
              {currentStep === 1 ? 'Store Info & Images' : 'Contact & Hours'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#FF6B35] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 2) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-8 py-8 overflow-y-auto max-h-[60vh]">


          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1D3557] mb-1">Store Info & Images</h2>
                <p className="text-gray-500 text-sm">Tell us about your store and upload your visuals</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
                <div className="flex items-center gap-5">
                  <div
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden cursor-pointer hover:border-[#FF6B35] transition-colors relative flex-shrink-0"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {logoPreview ? (
                      <>
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                        <button
                          className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow"
                          onClick={(e) => { e.stopPropagation(); clearLogo(); }}
                        >
                          <X className="w-3 h-3 text-gray-600" />
                        </button>
                      </>
                    ) : (
                      <Store className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-5 py-2.5 bg-[#FF6B35] text-white text-sm rounded-lg hover:bg-[#E55A2B] transition-colors"
                    >
                      Choose Logo
                    </button>
                    <p className="text-xs text-gray-500 mt-1.5">Square image, at least 200×200px</p>
                  </div>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Store Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="e.g., Mama's Kitchen"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
                <textarea
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  placeholder="Describe your store, cuisine type, specialties..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1D3557] mb-1">Contact & Hours</h2>
                <p className="text-gray-500 text-sm">How can customers reach you?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleMapSelect(true)}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap"
                > 
                  <Map className="w-4 h-4" />
                  Select on Map
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+63 912 345 6789"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Business Hours</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Opening Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="time"
                        name="openingTime"
                        value={formData.openingTime}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Closing Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="time"
                        name="closingTime"
                        value={formData.closingTime}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                      Delivery Options <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                      {(["Pick-up", "Food-Delivery", "both"] as const).map(option => {
                          const isSelected = formData.deliveryOptions === option;
                          const label = option === "Food-Delivery" ? "Food Delivery" : option === "both" ? "Both" : "Pick-up";
                          return (
                              <button
                                  key={option}
                                  type="button"
                                  onClick={() => handleDeliveryOptionChange(option)}
                                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-colors text-sm font-medium ${
                                      isSelected
                                          ? "bg-[#FF6B35] border-[#FF6B35] text-white"
                                          : "bg-white border-gray-300 text-gray-600 hover:border-[#FF6B35] hover:text-[#FF6B35]"
                                  }`}
                              >
                                  <div className={`w-2.5 h-2.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                                      isSelected ? "border-white" : "border-gray-400"
                                  }`}>
                                      {isSelected && <div className="w-1 h-1 rounded-full bg-white" />}
                                  </div>
                                  {label}
                              </button>
                          );
                      })}
                  </div>
              </div>
            </div>

          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div>
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Back
              </button>
            ) : (
              onSkip && (
                <button onClick={onSkip} className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors">
                  Skip for now
                </button>
              )
            )}
          </div>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="px-8 py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E55A2B] transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {currentStep === 2 ? (isLoading ? 'Saving...' : 'Complete Setup') : 'Next Step'}
          </button>
        </div>

      </div>

      {showMap && (
        <MapOverlay
          onClose={() => handleMapSelect(false)}
          onConfirm={(confirmed) => { 
            handleMapSelect(false, confirmed);
          }}
        />
      )}
    </div>
  );
}

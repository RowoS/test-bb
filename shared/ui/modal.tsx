import React from "react";

interface ModalProps{
    isOpen: boolean,
    onClose: () => void,
    children: React.ReactNode,
    title?: string 
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-2xl transform rounded-xl bg-accent-white p-6 shadow-2xl transition-all border border-black">

        <div className="absolute inset-0 -z-10" onClick={onClose} />
        
        {title && <h3 className="mb-4 text-xl font-bold text-gray-800">{title}</h3>}
        {children}
      </div>
       {/* Full screen invisible overlay to catch clicks outside the modal content box */}
       <div className="fixed inset-0 -z-20" onClick={onClose}></div>
    </div>
  );
};

export default Modal;
"use client";
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';



export default function ErrorPage() {
    const router = useRouter();

    const onGoBack = () => {
      router.back();
   }

    return (
    <div className="min-h-screen bg-[#F4D35E] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">

            <div className="mb-8 flex justify-center">
            <img 
                src="\error.png" 
                alt="404 Error" 
                className="w-64 h-auto"
            />
            </div>


            <h1 className="text-3xl font-bold text-[#1D3557] mb-4">
            Something went wrong.
            </h1>
            <p className="text-[#1D3557] text-lg mb-2">
            Please refresh your browser.
            </p>
            <p className="text-[#1D3557] text-lg mb-8">
            If issues persist, please contact customer support (No we won't).
            </p>

            <button
            onClick={onGoBack}
            className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-[#1D3557] text-[#1D3557] rounded-lg font-medium hover:bg-[#1D3557] hover:text-white transition-all"
            >
            <ArrowLeft className="w-5 h-5" />
            Go Back
            </button>
        </div>
        </div>
    );
}

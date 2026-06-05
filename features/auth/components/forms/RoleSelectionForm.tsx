"use client";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { useRoleSelection } from "@/features/auth/hooks/useRoleSelection";

export default function RoleSelectionForm() {
    const { values, setters, isLoading, submit } = useRoleSelection();
    
    const handleRoleSelect = (selectedRole: "customer" | "vendor") => {
        setters.setRole(selectedRole);
    }
    
    return (
        <div className="w-full max-w-md">
            {/* Logo and Title */}
            <div className="text-center mb-8">
                <div className="w-14 h-14 bg-accent-blue rounded-2xl flex items-center justify-center">
                    <Image
                        src="/logo.png"
                        alt="Buybites logo"
                        width={50}
                        height={50}
                        className="object-contain"
                    />
                </div>
                <span className="text-3xl font-bold text-white">Buybites</span>
                <h1 className="text-3xl font-bold text-white mb-2">
                    Create Account
                </h1>
                <p className="text-xl text-white/80">
                    Join us and start ordering delicious food
                </p>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex justify-center gap-4 pb-10">
                        <div className="h-2 w-40 rounded-full bg-accent-orange/40"></div>
                        <div className="h-2 w-40 rounded-full bg-accent-orange"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-[#1D3557] text-center mb-6">Choose Role</h2>
                    <div className="space-y-10">
                        <Button onClick={()=>handleRoleSelect("customer")} 
                            className={`w-full py-20 rounded-xl font-bold text-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02]
                            ${values.role === "customer"
                            ? "bg-accent-orange text-white"
                            : "bg-accent-yellow text-accent-blue hover:bg-accent-yellow/80"
                        }`}>
                            Customer
                        </Button>

                        <Button onClick={() => handleRoleSelect("vendor")}
                            className={`w-full py-20 rounded-xl font-bold text-xl transition-all shadow-md hover:shadow-lg hover:scale-[1.02]
                                ${values.role === "vendor"
                                ? "bg-accent-orange text-white"
                                : "bg-accent-yellow text-accent-blue hover:bg-accent-yellow/80"
                            }`}>
                            Vendor
                        </Button>
                    </div>
                </div>
            </div>

            <Button
                onClick={submit}
                disabled={isLoading || !values.role}
                className="w-full mt-6 bg-accent-blue text-white py-5 rounded-xl font-bold text-lg
                            disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? "Saving..." : "Continue"}
            </Button>
        </div>
    );
}

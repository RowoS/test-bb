"use client";

import { Lock } from "lucide-react";
import { Smartphone } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { InputField } from "@/shared/components/InputField";
import { useState } from "react";

interface TOTPFormProps {
  isLoading: boolean;
  onSubmit: (code: string) => void;
}

export default function TOTPForm({ isLoading, onSubmit }: TOTPFormProps) {
  const [totpCode, setTotpCode] = useState("");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-14 h-14 bg-accent-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Smartphone className="w-8 h-8 text-accent-orange" />
        </div>
        <h2 className="text-lg font-bold text-accent-black">Two-Factor Authentication</h2>
        <p className="text-sm text-accent-black/60 mt-1">
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      <InputField
        id="totp"
        type="text"
        label="Authentication Code"
        value={totpCode}
        placeholder="000000"
        icon={<Lock className="w-5 h-5" />}
        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
      />

      <Button
        type="button"
        onClick={() => onSubmit(totpCode)}
        disabled={isLoading || totpCode.length !== 6}
        className="w-full bg-accent-orange hover:bg-hover-orange text-white py-3.5 rounded-xl shadow-lg"
      >
        {isLoading ? "Verifying..." : "Verify"}
      </Button>
    </div>
  );
}
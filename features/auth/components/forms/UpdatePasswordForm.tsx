"use client";

import { Button } from "@/shared/ui/button";
import { InputField } from "@/shared/components/InputField";
import { useUpdatePasswordForm } from "@/features/auth/hooks/useUpdatePassForm";
import Image from "next/image";

export default function UpdatePasswordForm() {
  const {
    values,
    setters,
    fieldErrors,
    globalError,
    globalSuccess,
    isLoading,
    submit,
    clearFieldError,
  } = useUpdatePasswordForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DCE1DE] to-[#9CC5A1] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#216869] to-[#49A078] rounded-2xl flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Buybites logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <span className="text-3xl font-bold text-[#1F2421]">Buybites</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1F2421] mb-2">
            Reset Password
          </h1>
          <p className="text-[#1F2421]/70">
            Enter your details to reset your password
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={submit} className="space-y-4">
            <InputField
              label="New Password"
              type="password"
              value={values.password}
              onChange={(e) => {
                setters.setPassword(e.target.value);
                clearFieldError("password");
              }}
              error={fieldErrors.password}
            />

            <InputField
              label="Confirm New Password"
              type="password"
              value={values.confirmPassword}
              onChange={(e) => {
                setters.setConfirmPassword(e.target.value);
                clearFieldError("confirmPassword");
              }}
              error={fieldErrors.confirmPassword}
            />

            {globalError && (
              <p className="text-red-500 text-sm font-medium">
                {globalError}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#216869] to-[#49A078] hover:from-[#1a5657] hover:to-[#3d8a66] text-white py-3.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>

            {globalSuccess && (
              <p className="text-green-600 text-sm font-medium">
                {globalSuccess}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

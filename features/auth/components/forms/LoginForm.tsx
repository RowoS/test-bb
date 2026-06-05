"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Label } from "@/shared/ui/label";
import { InputField } from "@/shared/components/InputField";
import { LoginFormProps } from "@/shared/types";
import GoogleButton from "@/features/auth/components/shared/GoogleSignInButton";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import EmailVerificationModal from "../modals/EmailConfirmationModal";
import EmailVerifiedModal from "../modals/EmailVerifiedModal";
import TOTPForm from "../modals/TOTPModal";


export const LoginForm: React.FC<LoginFormProps> = ({ className, ...props }) => {
  const {
    values,
    setters,
    globalError,
    globalSuccess,
    fieldErrors,
    isLoading,
    submitTotp,
    submit,
    handleForgotPassword,
    clearFieldError,
  } = useLoginForm();


  const { email, password, rememberMe } = values;
  const { setEmail, setPassword, setRememberMe } = setters;
  const [showPassword, setShowPassword] = useState(false);
  const [totpCode, setTotpCode] = useState("");


  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      <div className="hidden md:block md:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/food-app.png")' }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      </div>

      <div className="flex-1 md:w-1/2 bg-gradient-to-b from-accent-orange from-[0.01%]
        via-accent-yellow via-[49.5%] to-accent-orange to-[99.99%]
        flex items-center justify-center p-4 md:p-8"{...props}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
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
            </div>
            <h1 className="text-3xl font-bold text-white/100 mb-2">
              Welcome Back
            </h1>
            <p className="text-white/90">
              Sign in to continue ordering delicious food
            </p>
          </div>

          {/* Messages */}
          {globalError && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-xl border border-red-200">
              {globalError}
            </div>
          )}

          {globalSuccess && (
            <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-xl border border-black-200">
              {globalSuccess}
              <a
                href="https://gmail.com"
                className="underline font-extrabold ml-1"
              >
                email.
              </a>
            </div>
          )}

          {!values.requiresMFA ? (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="space-y-6"
              >
                {/* Email */}
                <InputField
                  id="email"
                  type="email"
                  label="Email Address"
                  value={email}
                  placeholder="Enter your email"
                  icon={<Mail className="w-5 h-5" />}
                  error={fieldErrors.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearFieldError("email");
                  }}
                />

                {/* Password */}
                <InputField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  placeholder="Enter your password"
                  icon={<Lock className="w-5 h-5" />}
                  error={fieldErrors.password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                  }}
                  endAdornment={
                    <Button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-accent-orange bg-transparent hover:bg-transparent"
                    >
                      {showPassword ? (
                        <EyeOff/>) : (<Eye/>)
                      }
                    </Button>
                  }
                />

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox className="text-accent-orange"
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(v: boolean) =>
                        setRememberMe(v === true)
                      }
                    />
                    <Label htmlFor="remember" className="text-sm cursor-pointer text-[var(--accent-black)]">
                      Remember me
                    </Label>
                  </div>

                  <Button
                    type="button"
                    variant="link"
                    onClick= {handleForgotPassword}
                    className="text-accent-blue font-medium"
                  >
                    Forgot Password?
                  </Button>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent-orange hover:from-accent-orange hover:bg-hover-orange text-white py-3.5 rounded-xl shadow-lg"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* Legal */}
              <p className="text-center text-xs text-[var(--accent-black)]/60 mt-4">
                By logging in, you agree to FoodHub&apos;s{" "}
                <a href="/privacy-policy" className="underline font-bold text-accent-orange">
                  Privacy Policy
                </a>{" "}
                &{" "}
                <a href="/terms" className="underline font-bold text-accent-orange">
                  Terms of Use
                </a>
              </p>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-accent-black" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-accent-black/60">
                    Or continue with
                  </span>
                </div>
              </div>

              <GoogleButton nextRoute="/dashboard" />

              {/* Signup */}
              <p className="mt-6 text-center text-sm text-accent-black/60">
                Don&apos;t have an account?{" "}
                <a
                  href="/sign-up"
                  className="text-accent-orange font-medium hover:underline "
                >
                  Create one here
                </a>
              </p>

              {values.showVerificationModal && email && (
                <EmailVerificationModal
                  email={email}
                  onClose={() => setters.setShowVerificationModal(false)}
                />
              )}

              {values.showVerifiedEmailModal && (
                 <EmailVerifiedModal
                  onClose={() => setters.setShowVerifiedEmailModal(false)}
                />
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <TOTPForm isLoading={isLoading} onSubmit={submitTotp} />
            </div>
          )}
        </div>
      </div>
    </div>
    
  );
};

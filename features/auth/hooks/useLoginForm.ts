"use client";

import { useEffect, useState } from "react";
import {useRouter, useSearchParams } from "next/navigation";
import { loginUser, verifyMFA } from "../lib/auth-actions";
import { useAsyncForm } from "@/features/shared/hooks/useAsyncForm";
import { isValidEmail, validatePassword } from "@/features/auth/lib/validators";


type FieldErrors = {
  email?: string;
  password?: string;
};

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showVerifiedEmailModal, setShowVerifiedEmailModal] = useState(false);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);

  const {
    isLoading,
    error: globalError,
    success: globalSuccess,
    setError,
    run,
  } = useAsyncForm();

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setShowVerifiedEmailModal(true);

      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]); 

  const validateForm = () => {
    const errors: FieldErrors = {};
    
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email";
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const submit = async () => {
    if (!validateForm()) return;
    await run(async () => {
      const result = await loginUser(email, password);

      if (result.error) {
        if (result.error.message?.toLowerCase().includes('email not confirmed') ||
            result.error.message?.toLowerCase().includes('confirm your email')) {
          setShowVerificationModal(true);
          setError(null);
          return;
        }
        throw result.error;
      }

      if (result.requiresMFA) {
        setRequiresMFA(true);
        setMfaChallengeId(result.challengeId ?? null);
        setMfaFactorId(result.factorId ?? null);
        return;
      }

      router.refresh();
    });
  };

  const submitTotp = async (code: string) => {
    if (!mfaFactorId || !mfaChallengeId) return;
    await run(async () => {
      const result = await verifyMFA(mfaFactorId, mfaChallengeId, code);
      if (result.error) throw result.error;
      router.refresh();
    });
  };


  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/forgot-password");
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    values: { email, password, rememberMe, showVerificationModal, showVerifiedEmailModal, requiresMFA },
    setters: { setEmail, setPassword, setRememberMe, setShowVerificationModal, setShowVerifiedEmailModal, setRequiresMFA },
    fieldErrors,
    globalError,
    globalSuccess,
    isLoading,
    submitTotp,
    submit,
    handleForgotPassword,
    clearFieldError,
  };
}

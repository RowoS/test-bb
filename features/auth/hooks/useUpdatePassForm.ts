"use client";

import { useState } from "react";
import { useRouter} from "next/navigation";
import { updatePassword} from "../lib/auth-actions";
import { useAsyncForm } from "@/features/shared/hooks/useAsyncForm";
import { validatePassword } from "@/features/auth/lib/validators";

type FieldErrors = {
  password?: string;
  confirmPassword?: string;
};

export function useUpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const {
    isLoading,
    error: globalError,
    success: globalSuccess,
    setSuccess,
    run,
  } = useAsyncForm();


  const validateForm = () => {
    const errors: FieldErrors = {};

    const passwordError = validatePassword(password);
    if (passwordError) {
      errors.password = passwordError;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await run(async () => {
      const { error } = await updatePassword(password);
      if (error) throw error;

      setSuccess("Password updated successfully. Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    });
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    values: { password, confirmPassword },
    setters: { setPassword, setConfirmPassword },
    fieldErrors,
    globalError,
    globalSuccess,
    isLoading,
    submit,
    clearFieldError,
  };
}

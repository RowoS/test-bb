"use client";

import { useState } from "react";
import { forgetPassword } from "../lib/auth-actions";
import { useAsyncForm } from "@/features/shared/hooks/useAsyncForm";
import { isValidEmail } from "@/features/auth/lib/validators";

export function useForgetPasswordForm() {
  const [email, setEmail] = useState("");
  const { isLoading, error, success, setError, setSuccess, run } = useAsyncForm();

    const submit = async () => {
        if (!email.trim()) {
            setError("Email is required");
            return;
            }

            if (!isValidEmail(email)) {
            setError("Please enter a valid email");
            return;
            }

            await run(async () => {
            const { error } = await forgetPassword(email);
            if (error) throw error;

            setSuccess(
                "If an account with that email exists, a password reset link has been sent."
            );
        });
    };

    return {
        values: { email },
        setters: { setEmail },
        error,
        successMessage: success,
        isLoading,
        submit,
  };
};
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpUser } from '../lib/auth-actions';
import { useAsyncForm } from "@/features/shared/hooks/useAsyncForm";
import { isValidEmail, validatePassword } from "@/features/auth/lib/validators";

type FieldErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function useSignUpForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const {isLoading,error: globalError,run,} = useAsyncForm();

  const validateForm = () => {
    const errors: FieldErrors = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email address";
    }

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

  const submit = async () => {
    if (!validateForm()) return;

    await run(async () => {
      const { error } = await signUpUser(email, password, username);
      if (error) throw error;

      setShowVerificationModal(true);
    });
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    values: { username, email, password, confirmPassword, showVerificationModal },
    setters: {setUsername,setEmail,setPassword,setConfirmPassword, setShowVerificationModal},
    fieldErrors,
    globalError,
    isLoading,
    submit,
    clearFieldError,
  };
}

import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <img src="/loader.gif" alt="Loading" className="w-24 h-24" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
"use client";
import { Mail } from 'lucide-react';
import { useForgetPasswordForm} from '@/features/auth/hooks/useForgetPasswordForm';
import { InputField} from '@/shared/components/InputField'; 
import { Button } from '@/shared/ui/button';
import { getEmailLink } from '@/features/auth/lib/validators';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordSimple() {
  const { values, setters, error, successMessage, isLoading, submit } = useForgetPasswordForm();
  const router = useRouter();

  const onBackToLogin = () => {
    router.push('/login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-yellow/80 to-accent-orange flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-accent-blue mb-4 text-center">
          Forgot your password? Not to worry!
        </h1>
        <p className="text-accent-blue text-lg mb-8 text-center">
          Enter your email address below to receive instructions for the next step.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
            <InputField
                    id ="email" 
                    type="email"
                    icon = {<Mail className="w-5 h-5" />}
                    label ="Email Address"
                    value={values.email}
                    onChange={(e) => setters.setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-lg outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all text-lg placeholder:text-[#1D3557]/50"
                    required
            />

          {/* Submit Button */}
          <div className="pt-20">
            <Button
                type="submit"
                disabled={isLoading}
                className={`w-full max-w-xs mx-auto block text-xl rounded-lg font-semibold transition-all shadow-lg
                    ${isLoading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-accent-orange hover:bg-hover-orange hover:shadow-xl"}
                `}
                >
                {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          </div>
        </form>

        {successMessage && (
            <div className="mt-6 text-center space-y-3">
                <p className="text-green-600 font-medium">
                {successMessage}
                </p>

                <a
                href={getEmailLink(values.email)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[#FF6B35] font-semibold underline hover:opacity-80 transition"
                >
                Go to your email 📬
                </a>
            </div>
        )}

        {/* Back to Login Link */}
        {onBackToLogin && (
          <div className="mt-8 text-center">
            <button
              onClick={onBackToLogin}
              className="text-[#1D3557] hover:text-[#FF6B35] font-medium transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

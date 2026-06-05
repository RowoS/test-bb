"use client";
import { Mail, Lock, Eye, EyeOff, User, Smartphone } from 'lucide-react';
import { useState} from 'react';
import { Button } from '@/shared/ui/button';
import { useSignUpForm } from '../hooks/useSignUpForm';
import GoogleButton from '@/features/auth/components/GoogleSignInButton';
import { InputField } from '@/shared/components/InputField';
import EmailVerificationModal from '@/features/auth/components/EmailConfirmationModal';

interface SignUpProps {
  onSwitchToLogin?: () => void;
}

export default function SignUpPage({ onSwitchToLogin }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { values, setters, fieldErrors, globalError, isLoading, submit,clearFieldError} = useSignUpForm();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <>
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-14 h-14 bg-accent-blue rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">FoodHub</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-white/80">
            Join us and start ordering delicious food
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-center gap-4 pb-10">
            <div className="h-2 w-40 rounded-full bg-accent-orange"></div>
            <div className="h-2 w-40 rounded-full bg-accent-orange/40"></div>
          </div>
          
          {globalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
              {globalError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Form fields */}
            <InputField
              label="Full Name"
              placeholder='Enter your Full Name'
              icon={<User />}
              value={values.username}
              error={fieldErrors.username}
              onChange={(e) => {
                setters.setUsername(e.target.value);
                if (fieldErrors.username) clearFieldError('username');
              }}
            />

            <InputField
              label="Email Address"
              placeholder='Enter your Email Address'
              type="email"
              icon={<Mail />}
              value={values.email}
              error={fieldErrors.email}
              onChange={(e) => {
                setters.setEmail(e.target.value);
                if (fieldErrors.email) clearFieldError('email');
              }}
            />

            <InputField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your Password'
              icon={<Lock />}
              value={values.password}
              error={fieldErrors.password}
              onChange={(e) => {
                setters.setPassword(e.target.value);
                if (fieldErrors.password) clearFieldError('password');
              }}
              endAdornment={
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              }
            />

            <InputField
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Enter your Password Again'
              icon={<Lock />}
              value={values.confirmPassword}
              error={fieldErrors.confirmPassword}
              onChange={(e) => {
                setters.setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) clearFieldError('confirmPassword');
              }}
              endAdornment={
                <Button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </Button>
              }
            />

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 rounded border-black text-accent-orange focus:ring-hover-orange"
                required
              />
              <label htmlFor="terms" className="text-sm text-accent-black">
                I agree to the{' '}
                <a className="text-accent-orange font-medium hover:text-hover-orange">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a className="text-accent-orange font-medium hover:text-hover-orange">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-accent-orange to-accent-yellow text-white py-3.5 rounded-xl font-medium"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-accent-black" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-accent-black/60">
                Or sign up with
              </span>
            </div>
          </div>

          <GoogleButton nextRoute="/dashboard" />

          {/* Login */}
          <div className="mt-6 text-center">
            <p className="text-black/70">
              Already have an account?{' '}
              <Button
                onClick={onSwitchToLogin}
                className="text-accent-blue font-medium hover:text-hover-orange hover:underline"
              >
                Sign In
              </Button>
            </p>
          </div>
        </div>
      </div>

      {values.showVerificationModal && values.email && (
        <EmailVerificationModal
          email={values.email}
          onClose={() => {
            setters.setShowVerificationModal(false);
            if (onSwitchToLogin) onSwitchToLogin();
          }}
        />
      )}
    </>
  );
}
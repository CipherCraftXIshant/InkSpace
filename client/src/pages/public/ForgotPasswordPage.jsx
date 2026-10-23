import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import FormInput from '../../components/common/FormInput.jsx';
import Button from '../../components/common/Button.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="py-12 sm:py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-[#ECECE8] shadow-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="font-serif font-bold text-2xl text-[#121212] inline-block mb-3"
          >
            InkSpace
          </Link>
          <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
            Reset Password
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#737373]">
            Enter your email and we'll send you recovery instructions.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#121212]">
              Check your email
            </h3>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
              We have dispatched a password reset link to{' '}
              <strong className="text-[#121212]">{email}</strong>.
            </p>
            <div className="pt-4">
              <Button to="/login" variant="secondary" size="md" className="w-full">
                Back to Sign In
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Email address"
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your registered email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full justify-center mt-2"
            >
              Send Reset Link
            </Button>

            <div className="pt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#525252] hover:text-[#121212] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

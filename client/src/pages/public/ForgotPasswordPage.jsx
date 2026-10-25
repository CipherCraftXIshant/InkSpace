import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft, RotateCw } from 'lucide-react';
import FormInput from '../../components/common/FormInput.jsx';
import Button from '../../components/common/Button.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function ForgotPasswordPage() {
  useDocumentTitle('Reset Password');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  const validateEmail = (val) => {
    const trimmed = val?.trim() || '';
    if (!trimmed) {
      return 'Email address is required.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (touched) {
      setError(validateEmail(val));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setResendMessage('');
    }, 600);
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendMessage(`A fresh recovery link was dispatched to ${email}.`);
      setTimeout(() => setResendMessage(''), 4000);
    }, 500);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setEmail('');
    setError('');
    setTouched(false);
    setResendMessage('');
  };

  return (
    <div className="py-12 sm:py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#18181B] p-7 sm:p-10 rounded-2xl border border-[#ECECE8] dark:border-[#27272A] shadow-sm transition-colors">
        {/* Header */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="font-serif font-bold text-2xl tracking-tight text-[#121212] dark:text-[#F4F4F6] inline-block mb-3"
          >
            InkSpace
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#121212] dark:text-[#F4F4F6] tracking-tight">
            Reset Password
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#737373] dark:text-[#A1A1AA]">
            Enter your registered email and we'll dispatch password recovery instructions.
          </p>
        </div>

        {isSubmitted ? (
          /* Confirmation Screen */
          <div className="text-center space-y-4 py-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
              <CheckCircle2 className="w-6 h-6 stroke-[1.8]" />
            </div>

            <h2 className="font-serif text-xl font-medium text-[#121212] dark:text-[#F4F4F6]">
              Check your inbox
            </h2>

            <p className="text-xs sm:text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-xs mx-auto">
              We dispatched instructions to{' '}
              <strong className="text-[#121212] dark:text-white font-semibold">{email}</strong>. If an
              account exists for this address, you'll receive a password reset link shortly.
            </p>

            {resendMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
                {resendMessage}
              </div>
            )}

            <div className="pt-2 space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResend}
                isLoading={isResending}
                disabled={isResending}
                icon={RotateCw}
                className="w-full justify-center text-xs"
              >
                Resend instructions
              </Button>

              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-[#737373] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white underline cursor-pointer"
              >
                Use another email address
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <FormInput
              label="Account email address"
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="e.g. julian@example.com"
              required
              value={email}
              onChange={handleEmailChange}
              onBlur={handleBlur}
              error={touched ? error : ''}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              disabled={isLoading}
              icon={Mail}
              className="w-full justify-center mt-2 font-medium"
            >
              {isLoading ? 'Sending instructions...' : 'Send Reset Instructions'}
            </Button>
          </form>
        )}

        {/* Footer Links */}
        <div className="mt-8 pt-5 border-t border-[#ECECE8] dark:border-[#27272A] text-center space-y-2">
          <p className="text-xs text-[#737373] dark:text-[#A1A1AA]">
            Remembered your credentials?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#121212] dark:text-white hover:underline"
            >
              Sign in
            </Link>
          </p>
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-[11px] text-[#8A8A8A] dark:text-[#71717A] hover:text-[#121212] dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to homepage</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft, RotateCw } from 'lucide-react';
import FormInput from '../../components/common/FormInput.jsx';
import Button from '../../components/common/Button.jsx';

export default function ForgotPasswordPage() {
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
      <div className="w-full max-w-md bg-white p-7 sm:p-10 rounded-2xl border border-[#ECECE8] shadow-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="font-serif font-bold text-2xl tracking-tight text-[#121212] inline-block mb-3"
          >
            InkSpace
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#121212] tracking-tight">
            {isSubmitted ? 'Check Your Inbox' : 'Reset Password'}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#737373]">
            {isSubmitted
              ? 'Password recovery instructions have been sent.'
              : 'Enter your registered email and we will send recovery instructions.'}
          </p>
        </div>

        {isSubmitted ? (
          /* Confirmation State */
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <Mail className="w-6 h-6 stroke-[1.8]" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed">
                We sent a password reset link to{' '}
                <strong className="text-[#121212] font-semibold">{email}</strong>.
              </p>
              <p className="text-xs text-[#737373] leading-relaxed">
                Click the link in the message to choose a new password. The link expires in 15 minutes.
              </p>
            </div>

            {resendMessage && (
              <div
                className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2"
                role="status"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{resendMessage}</span>
              </div>
            )}

            <div className="p-3 bg-[#FAF9F5] border border-[#ECECE8] rounded-xl text-xs text-[#737373] space-y-1">
              <span className="font-semibold text-[#121212] block">Didn't receive the email?</span>
              <p className="leading-relaxed">
                Check your spam folder or click below to resend. Ensure the address entered matches your InkSpace account.
              </p>
            </div>

            <div className="pt-2 space-y-2.5">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleResend}
                isLoading={isResending}
                disabled={isResending}
                icon={RotateCw}
                className="w-full justify-center"
              >
                {isResending ? 'Resending...' : 'Resend Recovery Email'}
              </Button>

              <Button
                to="/login"
                variant="primary"
                size="md"
                className="w-full justify-center"
              >
                Back to Sign In
              </Button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-[#737373] hover:text-[#121212] cursor-pointer hover:underline"
              >
                Try a different email address
              </button>
            </div>
          </div>
        ) : (
          /* Initial Request Form */
          <>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <FormInput
                label="Email address"
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="e.g. alex.morgan@inkspace.dev"
                required
                value={email}
                onChange={handleEmailChange}
                onBlur={handleBlur}
                error={touched ? error : ''}
                helperText="We will send a secure password reset link to this address."
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full justify-center mt-3 font-medium"
              >
                {isLoading ? 'Sending Instructions...' : 'Send Recovery Instructions'}
              </Button>
            </form>

            {/* Footer Navigation */}
            <div className="mt-8 pt-5 border-t border-[#ECECE8] text-center space-y-2">
              <p className="text-xs text-[#737373]">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-[#121212] hover:underline"
                >
                  Sign in
                </Link>
              </p>
              <div>
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-[11px] text-[#8A8A8A] hover:text-[#121212] transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to homepage</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

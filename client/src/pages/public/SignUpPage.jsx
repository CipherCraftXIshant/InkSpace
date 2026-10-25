import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import FormInput from '../../components/common/FormInput.jsx';
import Button from '../../components/common/Button.jsx';
import { setMockAuthUser } from '../../utils/storage.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function SignUpPage() {
  useDocumentTitle('Create Account');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation & UI State
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Compute password strength
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-amber-400' };
    if (score <= 4) return { score: 2, label: 'Good', color: 'bg-emerald-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-600' };
  }, [password]);

  // Validation function
  const validate = (fields = { fullName, email, password, confirmPassword, agreeTerms }) => {
    const errs = {};

    if ('fullName' in fields) {
      const name = fields.fullName?.trim() || '';
      if (!name) {
        errs.fullName = 'Full name is required.';
      } else if (name.length < 2) {
        errs.fullName = 'Name must be at least 2 characters.';
      }
    }

    if ('email' in fields) {
      const emailVal = fields.email?.trim() || '';
      if (!emailVal) {
        errs.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        errs.email = 'Please enter a valid email address.';
      }
    }

    if ('password' in fields) {
      const pass = fields.password || '';
      if (!pass) {
        errs.password = 'Password is required.';
      } else if (pass.length < 8) {
        errs.password = 'Password must be at least 8 characters long.';
      }
    }

    if ('confirmPassword' in fields) {
      const confirm = fields.confirmPassword || '';
      if (!confirm) {
        errs.confirmPassword = 'Please confirm your password.';
      } else if (confirm !== (fields.password ?? password)) {
        errs.confirmPassword = 'Passwords do not match.';
      }
    }

    if ('agreeTerms' in fields) {
      if (!fields.agreeTerms) {
        errs.agreeTerms = 'You must agree to the Terms of Service to continue.';
      }
    }

    return errs;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const currentValues = {
      fullName,
      email,
      password,
      confirmPassword,
      agreeTerms,
    };
    const fieldErrs = validate({ [field]: currentValues[field] });
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrs[field],
    }));
  };

  const handleChange = (field, value) => {
    if (field === 'fullName') setFullName(value);
    if (field === 'email') setEmail(value);
    if (field === 'password') {
      setPassword(value);
      // Re-validate confirm password if it's already touched
      if (touched.confirmPassword) {
        const confirmErr = value !== confirmPassword ? 'Passwords do not match.' : '';
        setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
      }
    }
    if (field === 'confirmPassword') setConfirmPassword(value);
    if (field === 'agreeTerms') setAgreeTerms(value);

    if (touched[field]) {
      const updatedValues = {
        fullName,
        email,
        password,
        confirmPassword,
        agreeTerms,
        [field]: value,
      };
      const fieldErrs = validate({ [field]: updatedValues[field] });
      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrs[field],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError('');

    const allErrors = validate({
      fullName,
      email,
      password,
      confirmPassword,
      agreeTerms,
    });

    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    });

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setGeneralError('Please resolve the highlighted fields to continue.');
      return;
    }

    setIsLoading(true);

    // Simulate safe registration delay
    setTimeout(() => {
      setIsLoading(false);
      // Strictly store safe mock profile without password
      setMockAuthUser({
        name: fullName.trim(),
        email: email.trim(),
        role: 'author',
      });
      setIsSuccess(true);
    }, 700);
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
            Create an Account
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#737373]">
            Join our community of thoughtful essayists and curious readers.
          </p>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="text-center space-y-4 py-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#121212]">
              Welcome, {fullName}!
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-sm mx-auto">
              Your mock author account has been prepared with full access to the editorial workspace and writing desk.
            </p>
            <div className="p-3 bg-[#FAF9F5] border border-[#ECECE8] rounded-xl text-left text-xs text-[#737373] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#121212]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Client Demonstration State</span>
              </div>
              <p>
                In accordance with Phase 3 specifications, credentials are simulated locally. No real passwords or backend accounts are retained.
              </p>
            </div>
            <div className="pt-3 space-y-2.5">
              <Button
                to="/dashboard"
                variant="primary"
                size="md"
                className="w-full justify-center"
              >
                Go to Author Workspace
              </Button>
              <Button
                to="/explore"
                variant="secondary"
                size="md"
                className="w-full justify-center"
              >
                Explore Stories
              </Button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <>
            {/* Demonstration Notice */}
            <div className="mb-5 p-3 rounded-xl bg-[#FAF9F5] border border-[#ECECE8] text-xs flex items-start gap-2 text-[#737373]">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-[#121212]">Frontend Demo:</strong> Testing registration creates a client-side author profile so you can explore all dashboard features.
              </p>
            </div>

            {/* General Error Alert */}
            {generalError && (
              <div
                className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{generalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <FormInput
                label="Full name"
                id="signup-name"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="e.g. Elena Rostova"
                required
                value={fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                error={touched.fullName ? errors.fullName : ''}
              />

              <FormInput
                label="Email address"
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="e.g. elena@inkspace.dev"
                required
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={touched.email ? errors.email : ''}
              />

              <div>
                <FormInput
                  label="Password"
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a secure password"
                  required
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  error={touched.password ? errors.password : ''}
                />

                {/* Password Strength Indicator */}
                {password.length > 0 && !errors.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#737373]">
                      <span>Password strength:</span>
                      <span className="font-medium text-[#121212]">
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 h-1 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.score / 3) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <FormInput
                label="Confirm password"
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                error={touched.confirmPassword ? errors.confirmPassword : ''}
              />

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreeTerms}
                    onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                    onBlur={() => handleBlur('agreeTerms')}
                    className="mt-0.5 rounded border-[#D1D5DB] text-[#121212] focus:ring-1 focus:ring-[#121212] w-4 h-4 cursor-pointer accent-[#121212]"
                    aria-invalid={touched.agreeTerms && errors.agreeTerms ? 'true' : 'false'}
                  />
                  <span className="text-xs text-[#525252] leading-relaxed">
                    I agree to the{' '}
                    <span className="text-[#121212] font-medium underline">
                      Terms of Service
                    </span>{' '}
                    and acknowledge the{' '}
                    <span className="text-[#121212] font-medium underline">
                      Privacy Policy
                    </span>.
                  </span>
                </label>
                {touched.agreeTerms && errors.agreeTerms && (
                  <p className="mt-1.5 text-xs text-red-600" role="alert">
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full justify-center mt-3 font-medium"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Footer Link */}
            <div className="mt-8 pt-5 border-t border-[#ECECE8] text-center space-y-2">
              <p className="text-xs text-[#737373]">
                Already have an account?{' '}
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

import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, PenLine } from 'lucide-react';
import FormInput from '../../components/common/FormInput.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { registerAccount } from '../../services/api.js'; // lakshay

export default function SignUpPage() {
  useDocumentTitle('Create Account');
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard/editor';
  const notice = searchParams.get('notice');
  const { register } = useAuth();

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

  const handleSubmit = async (e) => {
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

    try {
      const result = await registerAccount({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      // Update the existing frontend authentication state.
      register({
        fullName: result.user.name,
        email: result.user.email,
        avatar: result.user.avatar,
      });

      setIsSuccess(true);
    } catch (error) {
      setGeneralError(error.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="py-12 sm:py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#18181B] p-7 sm:p-10 rounded-2xl border border-[#ECECE8] dark:border-[#27272A] shadow-sm transition-colors">
        {/* Registration Required Notice */}
        {notice === 'register_required' && !isSuccess && (
          <div
            className="mb-6 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5"
            role="alert"
          >
            <PenLine className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Author Registration Required</p>
              <p className="text-[11px] leading-relaxed opacity-90">
                You must register an author account before writing stories or accessing the author desk. Create your account below in seconds:
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="font-serif font-bold text-2xl tracking-tight text-[#121212] dark:text-[#F4F4F6] inline-block mb-3"
          >
            InkSpace
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#121212] dark:text-[#F4F4F6] tracking-tight">
            Create an Account
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#737373] dark:text-[#A1A1AA]">
            Join our publication. Register once to unlock writing and publishing.
          </p>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="text-center space-y-4 py-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
              <CheckCircle2 className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#121212] dark:text-[#F4F4F6]">
              Welcome to InkSpace, {fullName}!
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] dark:text-[#A1A1AA] leading-relaxed max-w-sm mx-auto">
              Your author account is ready with complete publishing capabilities. You can now compose stories, draft essays, and curate your editorial desk.
            </p>
            <div className="p-3 bg-[#FAF9F5] dark:bg-[#121214] border border-[#ECECE8] dark:border-[#27272A] rounded-xl text-left text-xs text-[#737373] dark:text-[#A1A1AA] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#121212] dark:text-[#F4F4F6]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Account Verified</span>
              </div>
              <p>
                Your profile has been saved. You have full author access to create, edit, and publish stories.
              </p>
            </div>
            <div className="pt-3 space-y-2.5">
              <Button
                to={redirectPath}
                variant="primary"
                size="md"
                className="w-full justify-center"
              >
                Start Writing Now
              </Button>
              <Button
                to="/dashboard"
                variant="secondary"
                size="md"
                className="w-full justify-center"
              >
                Go to Author Workspace
              </Button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <>
            {generalError && (
              <div
                className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
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
                placeholder="e.g. Julian Hayes"
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
                placeholder="julian@example.com"
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
                  placeholder="At least 8 characters"
                  required
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  error={touched.password ? errors.password : ''}
                />

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#737373] dark:text-[#A1A1AA]">
                      <span>Password strength:</span>
                      <span className="font-medium text-[#121212] dark:text-[#F4F4F6]">
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-[#E5E7EB] dark:bg-zinc-700 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'
                          } flex-1`}
                      />
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'
                          } flex-1`}
                      />
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'
                          } flex-1`}
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
                placeholder="Re-enter your password"
                required
                value={confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                error={touched.confirmPassword ? errors.confirmPassword : ''}
              />

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                    onBlur={() => handleBlur('agreeTerms')}
                    className="mt-0.5 rounded border-[#D1D5DB] dark:border-zinc-600 text-[#121212] dark:text-white focus:ring-1 focus:ring-[#121212] w-4 h-4 cursor-pointer accent-[#121212] dark:accent-zinc-200"
                  />
                  <span className="text-xs text-[#525252] dark:text-[#A1A1AA] leading-relaxed">
                    I agree to the{' '}
                    <span className="text-[#121212] dark:text-[#F4F4F6] underline">
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="text-[#121212] dark:text-[#F4F4F6] underline">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>
                {touched.agreeTerms && errors.agreeTerms && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
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
                className="w-full justify-center mt-2 font-medium"
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 pt-5 border-t border-[#ECECE8] dark:border-[#27272A] text-center space-y-2">
              <p className="text-xs text-[#737373] dark:text-[#A1A1AA]">
                Already have an account?{' '}
                <Link
                  to={notice ? `/login?redirect=${encodeURIComponent(redirectPath)}&notice=${notice}` : '/login'}
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
          </>
        )}
      </div>
    </div>
  );
}

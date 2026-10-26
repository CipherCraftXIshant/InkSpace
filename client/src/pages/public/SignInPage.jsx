import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, AlertCircle, ArrowLeft, PenLine } from 'lucide-react';
import FormInput from '../../components/common/FormInput.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { loginAccount } from '../../services/api.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

export default function SignInPage() {
  useDocumentTitle('Sign In');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const notice = searchParams.get('notice');
  const { login } = useAuth();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Validation & UI State
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoSelected, setDemoSelected] = useState('');

  // Validate fields
  const validate = (fieldValues = { email, password }) => {
    const newErrors = {};

    if ('email' in fieldValues) {
      const emailVal = fieldValues.email?.trim() || '';
      if (!emailVal) {
        newErrors.email = 'Email address is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
      }
    }

    if ('password' in fieldValues) {
      const passVal = fieldValues.password || '';
      if (!passVal) {
        newErrors.password = 'Password is required.';
      }
    }

    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate({ [field]: field === 'email' ? email : password });
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field],
    }));
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) {
      const fieldErrors = validate({ email: val });
      setErrors((prev) => ({ ...prev, email: fieldErrors.email }));
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) {
      const fieldErrors = validate({ password: val });
      setErrors((prev) => ({ ...prev, password: fieldErrors.password }));
    }
  };

  // Quick fill demo credentials
  const handleQuickFill = (role) => {
    setDemoSelected(role);
    setGeneralError('');
    if (role === 'author') {
      setEmail('alex.morgan@inkspace.dev');
      setPassword('Editorial2026!');
    } else if (role === 'admin') {
      setEmail('elena@inkspace.dev');
      setPassword('AdminPass2026!');
    } else {
      setEmail('clara.reader@inkspace.dev');
      setPassword('ReadingPass2026!');
    }
    setErrors({});
    setTouched({ email: true, password: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const validationErrors = validate({ email, password });
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setGeneralError('Please resolve the errors highlighted below.');
      return;
    }


    setIsLoading(true);

    try {
      const result = await loginAccount({
        email: email.trim(),
        password,
      });

      // Save the authenticated user's safe profile in the existing context.
      login(result.user);

      navigate(redirectPath);
    } catch (error) {
      setGeneralError(error.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }


    // Simulate safe authentication delay
    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = email.trim();
      const existingUser = findRegisteredUser(cleanEmail);

      let targetUser;
      if (existingUser) {
        targetUser = existingUser;
      } else if (cleanEmail.includes('admin') || cleanEmail.includes('elena')) {
        targetUser = {
          name: 'Elena Rostova',
          email: cleanEmail,
          role: 'admin',
          avatar:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        };
      } else if (cleanEmail.includes('alex')) {
        targetUser = {
          name: 'Alex Morgan',
          email: cleanEmail,
          role: 'author',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        };
      } else {
        targetUser = {
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'author',
        };
      }

      login(targetUser);
      navigate(redirectPath);
    }, 500);
  };

  return (
    <div className="py-12 sm:py-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#18181B] p-7 sm:p-10 rounded-2xl border border-[#ECECE8] dark:border-[#27272A] shadow-sm transition-colors">
        {/* Registration Required Notice if routed from Write or Protected Route */}
        {notice === 'register_required' && (
          <div
            className="mb-6 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5"
            role="alert"
          >
            <PenLine className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Sign in to write stories</p>
              <p className="text-[11px] leading-relaxed opacity-90">
                You must be signed in to write blogs and access your dashboard. Don't have an account yet?{' '}
                <Link
                  to={`/signup?redirect=${encodeURIComponent(redirectPath)}&notice=register_required`}
                  className="font-bold underline hover:opacity-80"
                >
                  Register here
                </Link>
                .
              </p>
            </div>
          </div>
        )}

        {notice === 'admin_required' && (
          <div
            className="mb-6 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 text-xs flex items-start gap-2.5"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Administrator access required</p>
              <p className="text-[11px] leading-relaxed opacity-90">
                Please sign in with administrator credentials (or click "Admin" below) to access the moderation console.
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
            Sign In
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#737373] dark:text-[#A1A1AA]">
            Welcome back. Sign in to your publishing workspace.
          </p>
        </div>

        {/* Demo Mode Banner & Fast-Fill */}
        <div className="mb-6 p-3.5 rounded-xl bg-[#FAF9F5] dark:bg-[#121214] border border-[#ECECE8] dark:border-[#27272A] text-xs">
          <div className="flex items-center gap-1.5 text-[#121212] dark:text-[#F4F4F6] font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Fast Sign-in Options</span>
          </div>
          <p className="text-[#666666] dark:text-[#A1A1AA] leading-relaxed mb-3">
            Choose a demo account or sign in with any registered author email:
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('author')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${demoSelected === 'author'
                  ? 'border-[#121212] bg-[#121212] text-white dark:border-white dark:bg-white dark:text-[#121212]'
                  : 'border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#4A4A4A] dark:text-[#D4D4D8] hover:border-[#121212] dark:hover:border-zinc-400'
                }`}
            >
              Author
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${demoSelected === 'admin'
                  ? 'border-[#121212] bg-[#121212] text-white dark:border-white dark:bg-white dark:text-[#121212]'
                  : 'border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#4A4A4A] dark:text-[#D4D4D8] hover:border-[#121212] dark:hover:border-zinc-400'
                }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('reader')}
              className={`flex-1 py-1.5 px-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${demoSelected === 'reader'
                  ? 'border-[#121212] bg-[#121212] text-white dark:border-white dark:bg-white dark:text-[#121212]'
                  : 'border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#18181B] text-[#4A4A4A] dark:text-[#D4D4D8] hover:border-[#121212] dark:hover:border-zinc-400'
                }`}
            >
              Reader
            </button>
          </div>
        </div>

        {/* General Error Alert */}
        {generalError && (
          <div
            className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center gap-2"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormInput
            label="Email address"
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="e.g. alex.morgan@inkspace.dev"
            required
            value={email}
            onChange={handleEmailChange}
            onBlur={() => handleBlur('email')}
            error={touched.email ? errors.email : ''}
          />

          <FormInput
            label="Password"
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your account password"
            required
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => handleBlur('password')}
            error={touched.password ? errors.password : ''}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#D1D5DB] dark:border-zinc-600 text-[#121212] dark:text-white focus:ring-1 focus:ring-[#121212] w-4 h-4 cursor-pointer accent-[#121212] dark:accent-zinc-200"
              />
              <span className="text-xs text-[#525252] dark:text-[#A1A1AA]">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-xs text-[#525252] dark:text-[#A1A1AA] hover:text-[#121212] dark:hover:text-white transition-colors font-medium hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full justify-center mt-2 font-medium"
          >
            {isLoading ? 'Signing In...' : 'Sign In to InkSpace'}
          </Button>
        </form>

        {/* Social Options (Demo) */}
        <div className="mt-7">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#ECECE8] dark:border-[#27272A]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-[#18181B] px-3 text-[#8A8A8A] dark:text-[#71717A]">
                or continue with
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleQuickFill('author')}
              className="p-2.5 rounded-full border border-[#ECECE8] dark:border-[#27272A] hover:border-[#121212] dark:hover:border-white hover:bg-[#F9FAFB] dark:hover:bg-[#27272A] transition-colors cursor-pointer text-[#4A4A4A] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white"
              aria-label="Demo login with Google"
              title="Demo Google Sign In"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('author')}
              className="p-2.5 rounded-full border border-[#ECECE8] dark:border-[#27272A] hover:border-[#121212] dark:hover:border-white hover:bg-[#F9FAFB] dark:hover:bg-[#27272A] transition-colors cursor-pointer text-[#4A4A4A] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white"
              aria-label="Demo login with GitHub"
              title="Demo GitHub Sign In"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 pt-5 border-t border-[#ECECE8] dark:border-[#27272A] text-center space-y-2">
          <p className="text-xs text-[#737373] dark:text-[#A1A1AA]">
            Don't have an account?{' '}
            <Link
              to={notice ? `/signup?redirect=${encodeURIComponent(redirectPath)}&notice=${notice}` : '/signup'}
              className="font-semibold text-[#121212] dark:text-white hover:underline"
            >
              Register here
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

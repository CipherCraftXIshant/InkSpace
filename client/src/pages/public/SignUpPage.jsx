import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../../components/common/FormInput.jsx';
import Button from '../../components/common/Button.jsx';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
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
            Create Account
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#737373]">
            Join our community of writers and readers.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full name"
            id="full-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <FormInput
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            label="Password"
            id="new-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            required
            helperText="Must be at least 8 characters long."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full justify-center mt-2"
          >
            Sign Up
          </Button>
        </form>

        {/* Social Options */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#ECECE8]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#8A8A8A]">or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              className="p-2.5 rounded-full border border-[#ECECE8] hover:border-[#121212] hover:bg-[#F9FAFB] transition-colors cursor-pointer text-[#4A4A4A] hover:text-[#121212]"
              aria-label="Sign up with Google"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </button>

            <button
              type="button"
              className="p-2.5 rounded-full border border-[#ECECE8] hover:border-[#121212] hover:bg-[#F9FAFB] transition-colors cursor-pointer text-[#4A4A4A] hover:text-[#121212]"
              aria-label="Sign up with GitHub"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </button>

            <button
              type="button"
              className="p-2.5 rounded-full border border-[#ECECE8] hover:border-[#121212] hover:bg-[#F9FAFB] transition-colors cursor-pointer text-[#4A4A4A] hover:text-[#121212]"
              aria-label="Sign up with Twitter"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-xs text-[#737373]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#121212] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

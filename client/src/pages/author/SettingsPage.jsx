import React, { useState } from 'react';
import { Check, Camera, ShieldCheck, Sun, Moon } from 'lucide-react';
import FormInput from '../../components/common/FormInput.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';

const AVATAR_PRESETS = [
  {
    name: 'Alex Morgan',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Sarah Johnson',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Marcus Chen',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Elena Rostova',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
  },
];

export default function SettingsPage() {
  useDocumentTitle('Account Settings');
  const { currentUser, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  const current = currentUser || {
    name: 'Alex Morgan',
    email: 'alex@inkspace.dev',
    role: 'author',
    avatar: AVATAR_PRESETS[0].url,
  };

  const [name, setName] = useState(current.name || 'Alex Morgan');
  const [email, setEmail] = useState(current.email || 'alex@inkspace.dev');
  const [role, setRole] = useState(current.role || 'author');
  const [bio, setBio] = useState(
    'Writing at the intersection of modern edge runtimes, compiler design, and software craftsmanship. Passionate about calm, minimal software design.'
  );
  const [avatar, setAvatar] = useState(current.avatar || AVATAR_PRESETS[0].url);

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Display name is required.');
      return;
    }

    setError('');
    setIsSaving(true);

    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        email: email.trim(),
        role: role.trim() || 'author',
        avatar: avatar.trim() || AVATAR_PRESETS[0].url,
      });

      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-[#ECECE8] dark:border-[#27272A]">
        <p className="text-[11px] font-bold tracking-widest uppercase text-[#737373] dark:text-[#A1A1AA] mb-1">
          AUTHOR PROFILE
        </p>
        <h1 className="font-serif text-3xl font-medium text-[#121212] dark:text-[#F4F4F6] tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A1A1AA] mt-1">
          Manage your public author persona, appearance preferences, and publication profile.
        </p>
      </div>

      {/* Main Settings Form */}
      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-[#18181B] p-6 sm:p-8 rounded-xl border border-[#ECECE8] dark:border-[#27272A] shadow-2xs space-y-6"
      >
        {/* Success Alert Banner */}
        {isSaved && (
          <div
            className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center gap-2 animate-in fade-in"
            role="status"
          >
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Author profile settings updated successfully! Changes are reflected across your workspace and navigation.
            </span>
          </div>
        )}

        {error && (
          <div
            className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-xl text-xs"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Profile Avatar Section */}
        <div>
          <label className="block text-xs font-semibold text-[#525252] dark:text-[#A1A1AA] mb-3">
            Author Profile Photography
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#ECECE8] dark:border-[#27272A] shadow-2xs"
                onError={(e) => {
                  e.currentTarget.src = AVATAR_PRESETS[0].url;
                }}
              />
              <div className="absolute bottom-0 right-0 p-1 bg-[#121212] dark:bg-white text-white dark:text-[#121212] rounded-full">
                <Camera className="w-3 h-3" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs bg-[#FAF9F5] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-lg px-3 py-2 text-[#121212] dark:text-[#F4F4F6] outline-hidden focus:bg-white dark:focus:bg-[#18181B] focus:border-[#121212] dark:focus:border-white"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-[#8A8A8A] dark:text-[#71717A] uppercase">
                  Presets:
                </span>
                {AVATAR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(p.url)}
                    className="text-[11px] font-medium px-2 py-0.5 rounded border border-[#ECECE8] dark:border-[#27272A] hover:border-[#121212] dark:hover:border-white bg-[#FAF9F5] dark:bg-[#27272A] text-[#4A4A4A] dark:text-[#D4D4D8] hover:text-[#121212] dark:hover:text-white cursor-pointer transition-colors"
                  >
                    {p.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#ECECE8] dark:border-[#27272A]" />

        {/* Theme / Appearance Preference */}
        <div>
          <label className="block text-xs font-semibold text-[#525252] dark:text-[#A1A1AA] mb-2">
            Appearance & Editorial Theme
          </label>
          <p className="text-xs text-[#737373] dark:text-[#A1A1AA] mb-3">
            Choose your preferred reading atmosphere. Dark mode softens contrast for late-night editing sessions.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                theme === 'light'
                  ? 'border-[#121212] bg-[#FAF9F5] dark:border-white dark:bg-white/10 text-[#121212] dark:text-white font-semibold ring-1 ring-black dark:ring-white'
                  : 'border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#121214] text-[#737373] dark:text-[#A1A1AA] hover:border-[#121212] dark:hover:border-white'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'border-[#121212] bg-[#FAF9F5] dark:border-white dark:bg-white/10 text-[#121212] dark:text-white font-semibold ring-1 ring-black dark:ring-white'
                  : 'border-[#ECECE8] dark:border-[#27272A] bg-white dark:bg-[#121214] text-[#737373] dark:text-[#A1A1AA] hover:border-[#121212] dark:hover:border-white'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        <div className="border-t border-[#ECECE8] dark:border-[#27272A]" />

        {/* Name and Email Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput
            label="Display Name"
            id="author-name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Alex Morgan"
          />

          <FormInput
            label="Contact Email"
            id="author-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="e.g. alex@inkspace.dev"
          />
        </div>

        {/* Role / Headline */}
        <div>
          <FormInput
            label="Editorial Role / Columnist Headline"
            id="author-role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Principal Systems Architect & Columnist"
          />
        </div>

        {/* Bio */}
        <div>
          <label
            htmlFor="author-bio"
            className="block text-xs font-semibold text-[#525252] dark:text-[#A1A1AA] mb-1.5"
          >
            Author Biography
          </label>
          <textarea
            id="author-bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your readers about your background, editorial focus, and research areas..."
            className="w-full text-xs sm:text-sm bg-white dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-lg p-3 text-[#121212] dark:text-[#F4F4F6] outline-hidden focus:border-[#121212] dark:focus:border-white focus:ring-1 focus:ring-[#121212] dark:focus:ring-white leading-relaxed"
          />
          <p className="mt-1 text-[11px] text-[#8A8A8A] dark:text-[#71717A]">
            Displayed at the footer of your published essays and on the masthead.
          </p>
        </div>

        {/* Client Demo Notice */}
        <div className="p-3 bg-[#FAF9F5] dark:bg-[#121214] rounded-xl border border-[#ECECE8] dark:border-[#27272A] text-xs text-[#737373] dark:text-[#A1A1AA] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            Non-sensitive profile customizations are preserved locally in browser storage for demonstration convenience.
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            disabled={isSaving}
          >
            Save Profile Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

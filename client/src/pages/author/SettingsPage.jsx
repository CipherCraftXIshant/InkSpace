import React, { useState } from 'react';
import { Check, Camera, ShieldCheck } from 'lucide-react';
import FormInput from '../../components/common/FormInput.jsx';
import Button from '../../components/common/Button.jsx';
import { getMockAuthUser, setMockAuthUser } from '../../utils/storage.js';

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
  const current = getMockAuthUser() || {
    name: 'Alex Morgan',
    email: 'alex@inkspace.dev',
    role: 'author',
    avatar: AVATAR_PRESETS[0].url,
  };

  const [name, setName] = useState(current.name || 'Alex Morgan');
  const [email, setEmail] = useState(current.email || 'alex@inkspace.dev');
  const [role, setRole] = useState('Staff Systems Architect & Columnist');
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
      setMockAuthUser({
        name: name.trim(),
        email: email.trim(),
        role: current.role || 'author',
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
      <div className="pb-2 border-b border-[#ECECE8]">
        <p className="text-[11px] font-bold tracking-widest uppercase text-[#737373] mb-1">
          AUTHOR PROFILE
        </p>
        <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-1">
          Manage your public author persona, profile photography, and publication details.
        </p>
      </div>

      {/* Main Settings Form */}
      <form
        onSubmit={handleSave}
        className="bg-white p-6 sm:p-8 rounded-xl border border-[#ECECE8] shadow-2xs space-y-6"
      >
        {/* Success Alert Banner */}
        {isSaved && (
          <div
            className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in"
            role="status"
          >
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Author profile settings updated successfully! Changes are reflected across your workspace and navigation.
            </span>
          </div>
        )}

        {error && (
          <div
            className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Profile Avatar Section */}
        <div>
          <label className="block text-xs font-semibold text-[#525252] mb-3">
            Author Profile Photography
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-full object-cover border-2 border-[#ECECE8] shadow-2xs"
                onError={(e) => {
                  e.currentTarget.src = AVATAR_PRESETS[0].url;
                }}
              />
              <div className="absolute bottom-0 right-0 p-1 bg-[#121212] text-white rounded-full">
                <Camera className="w-3 h-3" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs bg-[#FAF9F5] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#121212] outline-hidden focus:bg-white focus:border-[#121212]"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-[#8A8A8A] uppercase">
                  Presets:
                </span>
                {AVATAR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(p.url)}
                    className="text-[11px] font-medium px-2 py-0.5 rounded border border-[#ECECE8] hover:border-[#121212] bg-[#FAF9F5] text-[#4A4A4A] hover:text-[#121212] cursor-pointer"
                  >
                    {p.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#ECECE8]" />

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
            className="block text-xs font-semibold text-[#525252] mb-1.5"
          >
            Author Biography
          </label>
          <textarea
            id="author-bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell your readers about your background, editorial focus, and research areas..."
            className="w-full text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-lg p-3 text-[#121212] outline-hidden focus:border-[#121212] focus:ring-1 focus:ring-[#121212] leading-relaxed"
          />
          <p className="mt-1 text-[11px] text-[#8A8A8A]">
            Displayed at the footer of your published essays and on the masthead.
          </p>
        </div>

        {/* Client Demo Notice */}
        <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#ECECE8] text-xs text-[#737373] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
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

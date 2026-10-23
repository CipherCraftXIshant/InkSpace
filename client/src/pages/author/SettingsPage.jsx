import React, { useState } from 'react';
import { Check } from 'lucide-react';
import FormInput from '../../components/common/FormInput.jsx';
import Button from '../../components/common/Button.jsx';

export default function SettingsPage() {
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex@inkspace.dev');
  const [bio, setBio] = useState('Staff Systems Architect & Essayist writing on edge computing, modern frameworks, and minimal software design.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-medium text-[#121212] tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-1">
          Manage your author public profile and publication details.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-[#ECECE8] shadow-2xs space-y-6">
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        {/* Profile Picture */}
        <div>
          <label className="block text-xs font-semibold text-[#525252] mb-3">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
              alt="Alex Morgan"
              className="w-16 h-16 rounded-full object-cover border border-[#ECECE8]"
            />
            <div>
              <button
                type="button"
                className="px-3.5 py-1.5 text-xs font-medium border border-[#ECECE8] bg-[#FAF9F5] hover:bg-[#F0F0ED] rounded-md cursor-pointer mr-2"
              >
                Change Avatar
              </button>
              <button
                type="button"
                className="px-3.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="user-bio" className="block text-xs font-semibold text-[#525252] mb-1.5">
            Author Bio
          </label>
          <textarea
            id="user-bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full text-xs sm:text-sm bg-white border border-[#E5E7EB] rounded-md p-3 text-[#121212] outline-hidden focus:border-[#121212] focus:ring-1 focus:ring-[#121212]"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" size="md">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

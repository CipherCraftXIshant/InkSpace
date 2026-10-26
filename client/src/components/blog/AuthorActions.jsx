
import React, { useEffect, useState } from 'react';
import { ChevronDown, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  getAuthorPreferences,
  updateAuthorPreference,
} from '../../utils/authorPreferences.js';

export default function AuthorActions({ authorName, articleId }) {
  const { currentUser } = useAuth();
  const email = currentUser?.email || 'guest';
  const author = String(authorName || '').trim().toLowerCase();

  const [preferences, setPreferences] = useState(
    () => getAuthorPreferences(email)
  );

  useEffect(() => {
    const refresh = () => setPreferences(getAuthorPreferences(email));
    window.addEventListener('inkspace-preferences-change', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener('inkspace-preferences-change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [email]);

  if (!author) return null;

  const isBlocked = preferences.blocked.includes(author);
  const isFollowing = preferences.following.includes(author);

  const act = (type, value = author) => {
    setPreferences(updateAuthorPreference(email, type, value));
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2 mt-3 text-xs"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        disabled={isBlocked}
        onClick={() => act('following')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D4D4D4] dark:border-[#3F3F46] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] disabled:opacity-50"
      >
        <UserPlus className="w-3.5 h-3.5" />
        {isFollowing ? 'Following' : 'Follow author'}
      </button>

      <details className="relative">
        <summary className="list-none inline-flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-full border border-[#D4D4D4] dark:border-[#3F3F46] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A]">
          More <ChevronDown className="w-3.5 h-3.5" />
        </summary>

        <div className="absolute left-0 top-full mt-1 z-20 min-w-48 p-1 rounded-lg border border-[#E5E5E5] dark:border-[#3F3F46] bg-white dark:bg-[#18181B] shadow-lg">
          <button
            type="button"
            onClick={() => act('interested', articleId)}
            className="block w-full text-left px-3 py-2 rounded hover:bg-[#F4F4F5] dark:hover:bg-[#27272A]"
          >
            {preferences.interested.includes(articleId)
              ? '✓ Interested'
              : 'Interested'}
          </button>

          <button
            type="button"
            onClick={() => act('uninterested', articleId)}
            className="block w-full text-left px-3 py-2 rounded hover:bg-[#F4F4F5] dark:hover:bg-[#27272A]"
          >
            {preferences.uninterested.includes(articleId)
              ? '✓ Not interested'
              : 'Not interested'}
          </button>

          <button
            type="button"
            disabled={isBlocked}
            onClick={() => act('muted')}
            className="block w-full text-left px-3 py-2 rounded hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] disabled:opacity-50"
          >
            {preferences.muted.includes(author) ? 'Unmute author' : 'Mute author'}
          </button>

          <button
            type="button"
            onClick={() => act('blocked')}
            className="block w-full text-left px-3 py-2 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            {isBlocked ? 'Unblock author' : 'Block author'}
          </button>
        </div>
      </details>
    </div>
  );
}

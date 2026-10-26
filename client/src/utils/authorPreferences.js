
const STORAGE_KEY = 'inkspace_author_preferences';

const emptyPreferences = () => ({
  following: [],
  interested: [],
  uninterested: [],
  muted: [],
  blocked: [],
});

const normalize = (value) => String(value || '').trim().toLowerCase();

export function getAuthorPreferences(userEmail = 'guest') {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return all[normalize(userEmail)] || emptyPreferences();
  } catch {
    return emptyPreferences();
  }
}

export function updateAuthorPreference(userEmail, type, value) {
  const allowedTypes = [
    'following',
    'interested',
    'uninterested',
    'muted',
    'blocked',
  ];

  if (!allowedTypes.includes(type) || !value) {
    return getAuthorPreferences(userEmail);
  }

  const key = normalize(userEmail);
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const preferences = all[key] || emptyPreferences();
  const item = normalize(value);
  const exists = preferences[type].includes(item);

  if (type === 'interested' || type === 'uninterested') {
    const opposite = type === 'interested' ? 'uninterested' : 'interested';
    preferences[opposite] = preferences[opposite].filter(
      (entry) => entry !== item
    );
  }

  preferences[type] = exists
    ? preferences[type].filter((entry) => entry !== item)
    : [...preferences[type], item];

  // Blocking also removes an existing follow and mute.
  if (type === 'blocked' && !exists) {
    preferences.following = preferences.following.filter(
      (entry) => entry !== item
    );
    preferences.muted = preferences.muted.filter(
      (entry) => entry !== item
    );
  }

  // Following and muting are mutually exclusive.
  if (type === 'following' && !exists) {
    preferences.blocked = preferences.blocked.filter(
      (entry) => entry !== item
    );
    preferences.muted = preferences.muted.filter(
      (entry) => entry !== item
    );
  }

  all[key] = preferences;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event('inkspace-preferences-change'));

  return preferences;
}

import { useEffect } from 'react';

/**
 * Custom hook to update document title dynamically for SEO and browser tabs.
 */
export function useDocumentTitle(title, prefix = 'InkSpace') {
  useEffect(() => {
    const fullTitle = title
      ? `${title} — ${prefix}`
      : `${prefix} — Modern Editorial Publishing Platform`;
    document.title = fullTitle;
  }, [title, prefix]);
}

export default useDocumentTitle;

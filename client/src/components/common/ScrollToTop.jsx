import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures window scrolls to top on navigation.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

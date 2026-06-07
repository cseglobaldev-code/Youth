import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Id of the "Join the Movement" section rendered on the homepage. */
export const JOIN_SECTION_ID = 'join-section';

function scrollToJoin() {
  const el = document.getElementById(JOIN_SECTION_ID);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Returns a click handler that takes the user to the homepage "Join the
 * Movement" section from anywhere in the app. On the homepage it scrolls
 * directly; on other routes it navigates home and hands the scroll intent to
 * `useScrollToTop` (via router state) so it runs after the page renders.
 */
export function useJoinNavigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(() => {
    if (pathname === '/') {
      scrollToJoin();
    } else {
      navigate('/', { state: { scrollTo: JOIN_SECTION_ID } });
    }
  }, [navigate, pathname]);
}

import { useEffect } from 'react';

/**
 * Keeps `document.title` in sync with the given title.
 *
 * react-helmet-async@2.0.5 does not update `document.title` on re-render under
 * React 19, so the browser tab goes stale on SPA navigation and BG/EN toggle.
 * Setting it imperatively here sidesteps that bug.
 */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}

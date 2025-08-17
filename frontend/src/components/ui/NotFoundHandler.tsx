import { useEffect } from 'react';

export function NotFoundHandler() {
  useEffect(() => {
    console.log('404 - Page not found');
  }, []);

  return null;
}

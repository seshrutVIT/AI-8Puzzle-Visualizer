import { useEffect, useState } from 'react';

/** The page named in the URL hash (#solver), or `fallbackPage` when the hash names no known page. */
export function useHashPage(pageIds, fallbackPage) {
  const readPageFromUrl = () => {
    const requested = window.location.hash.slice(1);
    return pageIds.includes(requested) ? requested : fallbackPage;
  };

  const [page, setPage] = useState(readPageFromUrl);

  useEffect(() => {
    const handleHashChange = () => setPage(readPageFromUrl());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  });

  return page;
}

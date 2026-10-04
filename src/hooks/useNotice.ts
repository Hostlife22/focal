import { useCallback, useEffect, useState } from 'react';

const NOTICE_DURATION_MS = 3500;

export function useNotice() {
  const [notice, setNotice] = useState<{ message: string } | null>(null);
  const notify = useCallback((message: string) => setNotice({ message }), []);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(
      () => setNotice(null),
      NOTICE_DURATION_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [notice]);
  return { message: notice?.message, notify };
}

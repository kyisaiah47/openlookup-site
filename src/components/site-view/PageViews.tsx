'use client';
import { useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useSiteView } from './SiteViewProvider';

/** One of the two compositions of a route. Console renders until the provider reads a Simple choice.
 * A route that passes simpleView registers it, so the provider only switches to Simple where a
 * Simple composition exists. */
export default function PageViews({ consoleView, simpleView }: { consoleView: ReactNode; simpleView?: ReactNode }) {
  const mode = useSiteView();
  const path = usePathname();
  const offersSimple = simpleView !== undefined;
  const register = mode?.registerSimple;
  useEffect(() => {
    if (!offersSimple || !register) return;
    return register(path);
  }, [offersSimple, register, path]);
  return mode?.view === 'simple' && offersSimple ? simpleView : consoleView;
}

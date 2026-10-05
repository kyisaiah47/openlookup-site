'use client';
import Icon from '@/components/Icon';
import { useSiteView } from './SiteViewProvider';

/** The Console / Simple switch: the Console ticker (or beside the name), and beside the name in the Simple header. */
export default function ViewControls() {
  const mode = useSiteView();
  if (!mode) return null;
  return (
    <div className="sv-view-toggle" role="group" aria-label="Page view">
      <button type="button" onClick={() => mode.choose('console')} aria-pressed={mode.view === 'console'} title="Console view">
        <Icon name="terminal-window" size={12} />
        Console
      </button>
      <button type="button" onClick={() => mode.choose('simple')} aria-pressed={mode.view === 'simple'} title="Simple view">
        <Icon name="article" size={12} />
        Simple
      </button>
    </div>
  );
}

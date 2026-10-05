'use client';

/* THE COMMAND BOX. The primary action is adding the server to an MCP client, so the box holds the
 * real install for each client the package README documents, and one filled button copies it.
 * The client pick lives in the view provider, so it survives a switch to the Console and back. */
import { useId, useState } from 'react';
import { PRODUCT } from '@/lib/product';
import { useViewState } from './SiteViewProvider';

const DESKTOP = JSON.stringify({ mcpServers: { openlookup: { command: 'npx', args: ['-y', 'openlookup'] } } });

/* Each command is the README's own: the Claude Code line, the claude_desktop_config.json entry,
 * and the bare stdio command any other client runs. */
const CLIENTS = [
  { key: 'code', label: 'Claude Code', command: `claude mcp add openlookup -- ${PRODUCT.install}`, copy: `claude mcp add openlookup -- ${PRODUCT.install}` },
  { key: 'desktop', label: 'Claude Desktop', command: DESKTOP, copy: JSON.stringify(JSON.parse(DESKTOP), null, 2) },
  { key: 'stdio', label: 'Any stdio client', command: PRODUCT.install, copy: PRODUCT.install },
] as const;

export default function CommandBox() {
  const id = useId();
  const [key, setKey] = useViewState<string>('simple:client', 'code');
  const [state, setState] = useState<'idle' | 'copied' | 'refused'>('idle');
  const client = CLIENTS.find((c) => c.key === key) ?? CLIENTS[0];
  async function copy() {
    try {
      await navigator.clipboard.writeText(client.copy);
      setState('copied');
      setTimeout(() => setState('idle'), 1600);
    } catch {
      setState('refused');
    }
  }
  return (
    <div className="sv-cmdbox" id="install">
      <div className="sv-cmdbox-top">
        <span className="sv-cmdbox-lead">Add it to your MCP client</span>
        <div className="sv-cmdbox-tabs" role="tablist" aria-label="MCP client">
          {CLIENTS.map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={c.key === client.key}
              onClick={() => {
                setKey(c.key);
                setState('idle');
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div className="sv-cmdbox-row">
        <span className="sv-cmdbox-prompt" aria-hidden="true">$</span>
        <label className="sv-sr" htmlFor={id}>
          {client.label} command
        </label>
        <input id={id} readOnly value={client.command} spellCheck={false} onFocus={(e) => e.currentTarget.select()} />
        <button type="button" className="sv-btn sv-btn-acc" onClick={copy}>
          {state === 'copied' ? 'Copied' : 'Copy command'}
        </button>
      </div>
      <p className="sv-cmdbox-status" role="status" aria-live="polite">
        {state === 'refused' ? 'This browser blocked the clipboard. Select the text above and copy it.' : ''}
      </p>
    </div>
  );
}

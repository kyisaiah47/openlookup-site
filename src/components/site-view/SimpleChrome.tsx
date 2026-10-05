'use client';

/* The Simple chrome, A3. A solid white floating bar: OpenLookup's mark and wordmark with the links
 * grouped beside it, the Console / Simple switch, GitHub as a plain text link and one small filled
 * button for the install. The footer carries the server, the guides and the source in columns. */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PRODUCT } from '@/lib/product';
import Mark from './Mark';
import ViewControls from './ViewControls';

const NAV = [
  { href: '/#answers', label: 'Answers' },
  { href: '/#tools', label: 'Tools' },
  { href: '/#health', label: 'Health' },
  { href: '/guides/what-is-a-read-only-mcp-server', label: 'Guide' },
];

function Brand() {
  return (
    <Link className="sv-brand" href="/" aria-label={`${PRODUCT.displayName} home`}>
      <span className="sv-mark">
        <Mark size={24} />
      </span>
      <span className="sv-wordmark">{PRODUCT.displayName}</span>
    </Link>
  );
}

export function SimpleHeader() {
  return (
    <header className="sv-nav">
      <div className="sv-w">
        <div className="sv-nav-in">
          <div className="sv-brand-stack">
            <Brand />
            <nav aria-label="Main navigation">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <ViewControls />
          </div>
          <div className="sv-ctas">
            <a className="sv-txt" href={PRODUCT.repo} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <Link className="sv-btn sv-btn-ink sv-btn-sm" href="/#install">
              Install
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function SimpleFooter() {
  return (
    <footer className="sv-footer">
      <div className="sv-w">
        <div className="sv-foot">
          <div className="sv-foot-about">
            <Brand />
            <p>{PRODUCT.description}</p>
          </div>
          <nav aria-label="The server">
            <h5>The server</h5>
            <Link href="/#install">Install</Link>
            <Link href="/#answers">Real answers</Link>
            <Link href="/#tools">Every tool</Link>
            <Link href="/#health">Health check</Link>
          </nav>
          <nav aria-label="Guides">
            <h5>Guides</h5>
            <Link href="/guides/what-is-a-read-only-mcp-server">Read-only MCP servers</Link>
            <Link href="/guides/how-to-check-mcp-tool-safely">Checking an MCP tool</Link>
          </nav>
          <nav aria-label="Source">
            <h5>Source</h5>
            <a href={PRODUCT.repo} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
            <a href={PRODUCT.npm} target="_blank" rel="noreferrer">
              npm ↗
            </a>
            <a href="mailto:hello@thecompound.tech">Contact ↗</a>
          </nav>
        </div>
        <div className="sv-legal">
          <a href="https://thecompound.tech/?utm_source=compound-mcp-site&utm_medium=studio_credit">Built by Compound Labs</a>
          <span className="sv-mono">
            v{PRODUCT.version} · {PRODUCT.mcpName}
          </span>
        </div>
      </div>
    </footer>
  );
}

export function SimpleFrame({ children }: { children: ReactNode }) {
  return (
    <div className="sv-a3">
      <SimpleHeader />
      <main className="sv-main">{children}</main>
      <SimpleFooter />
    </div>
  );
}

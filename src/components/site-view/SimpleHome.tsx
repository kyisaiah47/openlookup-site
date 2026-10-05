'use client';

/* THE SIMPLE HOME, A3 · BENTO. A white hero with soft line waves and the install command box, a
 * strip of the public sources the tools read, a bento of real answers split by rules, a ledger of
 * every tool, one flat dark band carrying the package's own health check, and the guides.
 *
 * Tools come from lib/surface.ts (the server's own tools/list). Answers come from lib/samples.ts
 * (the server's own tools/call, written by scripts/capture-samples.mjs). Claims come from
 * lib/product.ts. Nothing on this page is typed by hand except the product names of the sources. */
import Link from 'next/link';
import { PRODUCT, SOURCES } from '@/lib/product';
import { PROBE, TOOLS, type ToolRow } from '@/lib/surface';
import { SAMPLES } from '@/lib/samples';
import CommandBox from './CommandBox';
import Waves from './Waves';
import { useViewState } from './SiteViewProvider';

/* The product each endpoint key belongs to, as the tools' own descriptions and the README name it. */
const SOURCE_NAME: Record<string, string> = {
  tooldrift: 'ToolDrift',
  stillshipping: 'StillShipping',
  stacktab: 'StackTab',
  rulestack: 'RuleStack',
  skillworks: 'SkillWorks',
  blockdex: 'BlockDex',
  kitgrade: 'KitGrade',
  storeready: 'StoreReady',
  civicbinder: 'CivicBinder',
  goodstanding: 'GoodStanding',
};

const GROUPS: { key: ToolRow['group']; label: string }[] = [
  { key: 'stale', label: 'Things that go stale' },
  { key: 'directory', label: 'Directories' },
  { key: 'compliance', label: 'Compliance' },
];

const quote = (key: string) => SOURCES.find((s) => s.quote.startsWith(key))?.quote ?? '';
const day = (iso: string) => iso.slice(0, 10);
const usd = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

/** A sample by tool name. The shapes are the server's; each cell reads the fields it shows. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sample<T = any>(tool: string) {
  const s = SAMPLES.find((x) => x.tool === tool);
  if (!s) throw new Error(`no captured sample for ${tool}`);
  return s as unknown as { tool: string; args: Record<string, unknown>; ran_at: string; ms: number; result: T };
}

/** The call as an agent writes it: tool({ key: "value" }). */
function callLine(s: { tool: string; args: Record<string, unknown> }) {
  const parts = Object.entries(s.args).map(([k, v]) => `${k}: ${JSON.stringify(v)}`);
  return `${s.tool}({ ${parts.join(', ')} })`;
}

function toolOf(name: string) {
  return TOOLS.find((t) => t.name === name)!;
}

/* The unique public sources, in the order the tools list them. */
const SOURCE_KEYS = [...new Set(TOOLS.map((t) => t.endpoint.key))];

function Cell({ name, className, children }: { name: string; className?: string; children: React.ReactNode }) {
  const s = sample(name);
  return (
    <article className={`sv-cell ${className ?? ''}`}>
      <header className="sv-cell-head">
        <h3>{toolOf(name).title}</h3>
        <code className="sv-call">{callLine(s)}</code>
      </header>
      <div className="sv-cell-body">{children}</div>
      <p className="sv-cell-foot">
        Read from {SOURCE_NAME[toolOf(name).endpoint.key]} on {day(s.ran_at)} in {s.ms} ms.
      </p>
    </article>
  );
}

type Models = { models: { rank: number; model: string; blended_usd_per_mtok: number; price_band: string; rationale: string }[] };
type Ada = {
  entity_name: string;
  city: string;
  state: string;
  grade: string;
  grade_meaning: string;
  violations_total: number;
  violations_serious: number;
  violations_critical: number;
  deadline_label: string;
  scanned_at: string;
  pages_scanned: number;
  report_url: string;
  domain: string;
};
type Stack = { users: number; monthly_total_usd: number; services: { service: string; plan: string; monthly_usd: number; lines: { usd: number }[] }[] };
type Builders = { total: number; builders: { builder: string; verdict: string; who_submits: string; exports_source: string }[] };
type Maint = { results: { name: string; status: string; last_release: string; last_commit: string; stars: number }[] };
type Nonprofit = { ein: string; clear: boolean; checked: { sources: string[]; scope: string } };

const VERDICT: Record<string, string> = { ships: 'pass', 'ships-with-caveats': 'warn', blocked: 'fail', unknown: 'none' };

function Bento() {
  const models = sample<Models>('compare_ai_models').result;
  const ada = sample<Ada>('lookup_ada_report').result;
  const stack = sample<Stack>('estimate_stack_cost').result;
  const builders = sample<Builders>('compare_app_builders').result;
  const maint = sample<Maint>('check_project_maintenance').result;
  const np = sample<Nonprofit>('lookup_nonprofit_status').result;
  const peak = Math.max(...stack.services.map((s) => s.monthly_usd));
  return (
    <div className="sv-bento">
      <Cell name="compare_ai_models" className="sv-span-7">
        <table className="sv-table">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Model</th>
              <th scope="col" className="sv-num">
                Blended per M tokens
              </th>
              <th scope="col">Band</th>
            </tr>
          </thead>
          <tbody>
            {models.models.map((m) => (
              <tr key={m.model}>
                <td className="sv-dimcell">{m.rank}</td>
                <td>
                  <code>{m.model}</code>
                </td>
                <td className="sv-num">{usd(m.blended_usd_per_mtok)}</td>
                <td className="sv-dimcell">{m.price_band}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="sv-cell-note">
          <code>{models.models[0].model}</code>: {models.models[0].rationale}
        </p>
      </Cell>

      <Cell name="lookup_ada_report" className="sv-span-5">
        <p className="sv-verdict">
          {ada.entity_name} in {ada.city}, {ada.state} has grade <b className="sv-acc-text">{ada.grade}</b>: {ada.grade_meaning}.
        </p>
        <dl className="sv-kv">
          <div>
            <dt>Violations</dt>
            <dd>
              {ada.violations_total} total, {ada.violations_serious} serious, {ada.violations_critical} critical
            </dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>{ada.deadline_label}</dd>
          </div>
          <div>
            <dt>Scanned</dt>
            <dd>
              {day(ada.scanned_at)}, {ada.pages_scanned} page
            </dd>
          </div>
        </dl>
        <a className="sv-textlink" href={ada.report_url} target="_blank" rel="noreferrer">
          The public report ↗
        </a>
      </Cell>

      <Cell name="estimate_stack_cost" className="sv-span-5">
        <p className="sv-verdict">
          This stack costs {usd(stack.monthly_total_usd)} a month at {stack.users.toLocaleString('en-US')} users.
        </p>
        <ul className="sv-bill">
          {stack.services.map((s) => (
            <li key={s.service}>
              <span className="sv-bill-name">
                {s.service} <span className="sv-dimcell">{s.plan}</span>
              </span>
              <span className="sv-bill-bar" aria-hidden="true">
                <i style={{ width: `${Math.max(2, (s.monthly_usd / peak) * 100)}%` }} />
              </span>
              <span className="sv-num">{usd(s.monthly_usd)}</span>
            </li>
          ))}
        </ul>
      </Cell>

      <Cell name="compare_app_builders" className="sv-span-7">
        <table className="sv-table">
          <thead>
            <tr>
              <th scope="col">Builder</th>
              <th scope="col">Verdict</th>
              <th scope="col">Who submits</th>
              <th scope="col">Exports source</th>
            </tr>
          </thead>
          <tbody>
            {builders.builders.map((b) => (
              <tr key={b.builder}>
                <td>{b.builder}</td>
                <td>
                  <span className="sv-status" data-s={VERDICT[b.verdict] ?? 'none'}>
                    {b.verdict}
                  </span>
                </td>
                <td className="sv-dimcell">{b.who_submits}</td>
                <td className="sv-dimcell">{b.exports_source}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="sv-cell-note">
          {builders.builders.length} of {builders.total} builders shown.
        </p>
      </Cell>

      <Cell name="check_project_maintenance" className="sv-span-7">
        <table className="sv-table">
          <thead>
            <tr>
              <th scope="col">Project</th>
              <th scope="col">Status</th>
              <th scope="col">Last release</th>
              <th scope="col">Last commit</th>
            </tr>
          </thead>
          <tbody>
            {maint.results.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td>
                  <span className="sv-status" data-s={r.status === 'dead' ? 'fail' : 'pass'}>
                    {r.status}
                  </span>
                </td>
                <td className="sv-dimcell">{day(r.last_release)}</td>
                <td className="sv-dimcell">{day(r.last_commit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="sv-cell-note">Use before recommending a dependency. A library that was healthy at training time may have been abandoned since.</p>
      </Cell>

      <Cell name="lookup_nonprofit_status" className="sv-span-5">
        <p className="sv-verdict">
          <span className="sv-status" data-s={np.clear ? 'pass' : 'fail'}>
            {np.clear ? 'clear' : 'listed'}
          </span>{' '}
          EIN {np.ein} is on none of the tracked lists.
        </p>
        <ul className="sv-list">
          {np.checked.sources.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="sv-cell-note">{np.checked.scope}</p>
      </Cell>
    </div>
  );
}

function Ledger() {
  const [open, setOpen] = useViewState<string | null>('simple:tool', null);
  return (
    <div className="sv-ledger">
      {GROUPS.map((g) => (
        <div className="sv-ledger-group" key={g.key}>
          <div className="sv-ledger-label">
            <span className="sv-sq" data-g={g.key} aria-hidden="true" />
            {g.label}
          </div>
          <div className="sv-ledger-rows">
            {TOOLS.filter((t) => t.group === g.key).map((t) => {
              const isOpen = open === t.name;
              return (
                <div className="sv-ledger-row" key={t.name} data-open={isOpen}>
                  <button type="button" aria-expanded={isOpen} aria-controls={`tool-${t.name}`} onClick={() => setOpen(isOpen ? null : t.name)}>
                    <code>{t.name}</code>
                    <span className="sv-ledger-title">{t.title}</span>
                    <span className="sv-ledger-host">{SOURCE_NAME[t.endpoint.key]}</span>
                    <span className="sv-sign" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div id={`tool-${t.name}`} className="sv-reveal" data-open={isOpen} inert={!isOpen}>
                    <div>
                      <div className="sv-ledger-detail">
                        <p>{t.description}</p>
                        <dl className="sv-args">
                          {t.args.map((a) => (
                            <div key={a.name}>
                              <dt>
                                <code>{a.name}</code> <span>{a.type}, {a.required ? 'required' : 'optional'}</span>
                              </dt>
                              <dd>{a.describe}</dd>
                            </div>
                          ))}
                        </dl>
                        <p className="sv-cell-note">
                          Reads {t.endpoint.host}. It does not write, delete, or require credentials.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SimpleHome() {
  const every = (k: 'readOnlyHint' | 'idempotentHint' | 'openWorldHint') => TOOLS.filter((t) => t.annotations[k]).length;
  const destructive = TOOLS.filter((t) => t.annotations.destructiveHint).length;
  return (
    <div className="sv-home">
      <section className="sv-hero">
        <Waves />
        <div className="sv-w sv-hero-in">
          <h1>{PRODUCT.subhead}</h1>
          <p className="sv-lede">
            {PRODUCT.displayName} provides an MCP client {TOOLS.length} read-only lookup tools backed by live public data. The
            package reads public endpoints and returns a structured result.
          </p>
          <CommandBox />
          <p className="sv-facts">The server needs no account or API key and runs through npx. It is version {PRODUCT.version}.</p>
        </div>
      </section>

      <section className="sv-strip" aria-label="Public sources the tools read">
        <div className="sv-strip-lead">
          <p>Every tool reads public data. You do not sign up or paste a key.</p>
        </div>
        <ul className="sv-strip-cells">
          {SOURCE_KEYS.map((k) => (
            <li key={k}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/sources/${k}.svg`} alt="" width={20} height={20} />
              <span>{SOURCE_NAME[k]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="sv-sec sv-sec-sink" id="answers">
        <div className="sv-w">
          <div className="sv-head-split">
            <h2>What an agent can ask.</h2>
            <p>{quote('Every tool returns both content')}</p>
          </div>
          <Bento />
          <p className="sv-bento-note">
            Each answer above is the structuredContent the server returned, trimmed to the fields shown. The calls ran on{' '}
            {day(SAMPLES[0].ran_at)}.
          </p>
        </div>
      </section>

      <section className="sv-sec" id="tools">
        <div className="sv-w sv-ledger-wrap">
          <div className="sv-head-stack">
            <h2>{PRODUCT.description}</h2>
            <p>{quote('Most of these answer')}</p>
            <p className="sv-hint">Pick a tool to see what it answers, what it needs, and where it reads data from.</p>
          </div>
          <Ledger />
        </div>
      </section>

      <section className="sv-band" id="health">
        <div className="sv-w">
          <h2>Results carry a date.</h2>
          <p className="sv-band-sub">
            Pricing, routing, maintenance, and directory records are live data. A receipt or date travels with the results where
            the package provides one.
          </p>
          <div className="sv-band-grid">
            <div className="sv-band-panel">
              <h3>Every call</h3>
              <p>What each tool declares to the client in its annotations.</p>
              <ul className="sv-band-rows">
                <li>
                  <span>Read only</span>
                  <code>
                    {every('readOnlyHint')} of {TOOLS.length}
                  </code>
                </li>
                <li>
                  <span>Idempotent</span>
                  <code>
                    {every('idempotentHint')} of {TOOLS.length}
                  </code>
                </li>
                <li>
                  <span>Reads the open web</span>
                  <code>
                    {every('openWorldHint')} of {TOOLS.length}
                  </code>
                </li>
                <li>
                  <span>Destructive</span>
                  <code>
                    {destructive} of {TOOLS.length}
                  </code>
                </li>
              </ul>
            </div>
            <div className="sv-band-panel">
              <h3>Last health check</h3>
              <p>
                The package&rsquo;s own probe ran on {day(PROBE.checked_at)}. {PROBE.endpoints_checked - PROBE.endpoints_failed} of{' '}
                {PROBE.endpoints_checked} public endpoints answered.
              </p>
              <ul className="sv-band-rows sv-band-rows-2">
                {PROBE.endpoints.map((e) => (
                  <li key={e.name}>
                    <span>
                      <span className="sv-status" data-s={e.ok ? 'pass' : 'fail'}>
                        {SOURCE_NAME[e.name.split('-')[0]] ?? new URL(e.url).host}
                      </span>
                    </span>
                    <code>
                      {e.http} · {e.ms} ms
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="sv-sec">
        <div className="sv-w sv-close">
          <h2>Check an MCP tool first.</h2>
          <nav className="sv-close-links" aria-label="Next steps">
            <Link href="/guides/what-is-a-read-only-mcp-server">
              <b>What is a read-only MCP server?</b>
              <span>This guide explains read-only MCP tools, their boundaries, and how to try OpenLookup.</span>
            </Link>
            <Link href="/guides/how-to-check-mcp-tool-safely">
              <b>How to check an MCP tool before you call it</b>
              <span>Inspect the schema, confirm the boundary, and verify the result before relying on an agent answer.</span>
            </Link>
            <a href={PRODUCT.repo} target="_blank" rel="noreferrer">
              <b>Read the source ↗</b>
              <span>The package is on npm and GitHub.</span>
            </a>
          </nav>
        </div>
      </section>
    </div>
  );
}


import React from 'react';
import ReactDOM from 'react-dom/client';
import r2wc from 'react-to-webcomponent';
import CampaignPacingCalculator from './CampaignPacingCalculator';

// ---- Inject styles at runtime (single <script> embed; no <link>) ----
const STYLE_ID = 'pacing-calculator-widget-styles';
const CSS = `
/* reset-ish */
.pw * { box-sizing: border-box; }
.pw { max-width: 1200px; margin: 24px auto; padding: 40px 24px; background:#fff; border:1px solid #e5e7eb; border-radius:16px; color:#1d1d1f; font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',sans-serif; }
.pw h1 { font-size: 40px; line-height:1.2; font-weight: 800; text-align:center; margin: 0 0 8px; }
.pw .sub { text-align:center; color:#6b7280; margin:0 0 32px; }

.pw .grid { display:grid; grid-template-columns: 1fr; gap: 20px; }
@media (min-width:1024px){ .pw .grid { grid-template-columns:1fr 1fr; gap: 40px; } }

.pw .group { display:flex; flex-direction:column; gap:8px; }
.pw label { font-weight:700; font-size:15px; color:#111827; }
.pw .help { font-size:12px; color:#6b7280; margin-top:2px; }

.pw .wrap { position:relative; }
.pw .sym { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#9ca3af; font-weight:600; }
.pw input[type="number"] { width:100%; padding:14px 16px; font-size:16px; border:2px solid #d1d5db; border-radius:12px; background:#fff; outline:none; transition:.15s; }
.pw input[type="number"].sympad { padding-left:30px; }
.pw input[type="number"]:hover { border-color:#a1a1a6; }
.pw input[type="number"]:focus { border-color:#2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,.12); }
.pw input[type="number"].err { border-color:#ef4444; }
.pw input[type="number"].err:focus { box-shadow: 0 0 0 4px rgba(239,68,68,.12); }
.pw .errmsg { color:#ef4444; font-size:12px; margin-top:4px; display:none; }
.pw .errmsg.show { display:block; }

.pw .btnrow { display:flex; gap:12px; margin-top:8px; }
.pw button { padding:14px 16px; font-weight:700; border-radius:12px; border:2px solid transparent; cursor:pointer; transition:.15s; }
.pw .primary { background:#111827; color:#fff; flex:1; }
.pw .primary:hover { background:#0b1220; transform: translateY(-1px); }
.pw .secondary { background:#fff; color:#111827; border-color:#d1d5db; }
.pw .secondary:hover { background:#f3f4f6; border-color:#a1a1a6; }

.pw .panel { background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px; padding:24px; min-height:340px; display:flex; flex-direction:column; justify-content:center; }
.pw .placeholder { text-align:center; color:#6b7280; }
.pw .metricbox { margin-bottom:18px; padding-bottom:18px; border-bottom:1px solid #e5e7eb; }
.pw .metricbox:last-child { border-bottom:none; margin-bottom:0; padding-bottom:0; }
.pw .mlab { text-transform:uppercase; letter-spacing:.04em; color:#6b7280; font-weight:700; font-size:12px; margin-bottom:6px; }
.pw .mval { font-size:32px; font-weight:800; }
.pw .mval.warn { color:#f59e0b; } .pw .mval.danger { color:#ef4444; } .pw .mval.ok { color:#0f766e; }

.pw .bar { height:12px; background:#e5e7eb; border-radius:999px; overflow:hidden; margin-top:6px; }
.pw .bar > span { display:block; height:100%; width:0%; background:#374151; transition:width .4s; }

.pw .foot { margin-top:10px; font-size:12px; color:#9ca3af; }
`;

function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = CSS;
    document.head.appendChild(s);
  }
}
ensureStyles();
// --------------------------------------------------------------------

const WebComponent = r2wc(CampaignPacingCalculator, React, ReactDOM, {
  shadow: false,
  props: { config: 'json' },
});

if (!customElements.get('r2wc-pacing-calculator')) {
  customElements.define('r2wc-pacing-calculator', WebComponent);
}

import { html } from '../html.js';

/** A list of "label, value" rows. `rows` is [{ label, value, monospace? }]. */
export function LabelledValues({ rows }) {
  return html`
    <dl>
      ${rows.map(({ label, value, monospace }) => html`
        <div key=${label} className="labelled-row">
          <dt>${label}</dt>
          <dd className=${monospace ? 'monospace' : ''}>${value}</dd>
        </div>
      `)}
    </dl>
  `;
}

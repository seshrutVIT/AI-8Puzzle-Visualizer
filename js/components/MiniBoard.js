import { html } from '../html.js';
import { BLANK } from '../logic/puzzle.js';

/** A small static picture of one state, with an optional caption underneath. */
export function MiniBoard({ state, isGoal = false, caption }) {
  return html`
    <figure className="text-center text-sm text-muted">
      <div className=${`inline-grid grid-cols-3 gap-px p-px ${isGoal ? 'bg-goal' : 'bg-ink'}`}>
        ${[...state].map((tile, cellIndex) => html`
          <span
            key=${cellIndex}
            className=${`size-[18px] text-center text-xs leading-[18px] ${tile === BLANK ? 'bg-blank' : 'bg-white text-ink'}`}
          >${tile === BLANK ? '' : tile}</span>
        `)}
      </div>
      ${caption !== undefined && html`<figcaption>${caption}</figcaption>`}
    </figure>
  `;
}

import { html } from '../html.js';

/** Nine text boxes for typing a state. `cells` holds exactly what was typed in each box. */
export function StateGrid({ title, cells, onChange }) {
  const changeCell = (cellIndex, typedText) => {
    onChange(cells.map((cell, index) => (index === cellIndex ? typedText : cell)));
  };

  return html`
    <div>
      <h4 className="mb-1 font-heading">${title}</h4>
      <div className="grid w-fit grid-cols-3 gap-1">
        ${cells.map((cell, cellIndex) => html`
          <input
            key=${cellIndex}
            className="cell-input"
            maxLength=${1}
            aria-label=${`${title}, cell ${cellIndex + 1}`}
            value=${cell}
            onChange=${event => changeCell(cellIndex, event.target.value)}
          />
        `)}
      </div>
    </div>
  `;
}

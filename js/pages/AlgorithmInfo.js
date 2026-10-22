import { Fragment } from 'react';
import { html } from '../html.js';
import { LabelledValues } from '../components/LabelledValues.js';
import { ALGORITHM_REFERENCE, DLS_DETAILS } from '../content/algorithmInfo.js';

export function AlgorithmInfo() {
  return html`
    <${Fragment}>
    <h2 className="page-title">Algorithm information</h2>
    <section className="card max-w-4xl">
      <h3 className="section-title">Depth Limited Search (DLS)</h3>
      <${LabelledValues} rows=${DLS_DETAILS} />
    </section>

    <h3 className="section-title mt-6">Reference: every algorithm in the assignment</h3>
    <p className="hint mb-2">
      Standard textbook properties for unit step costs. b is the branching factor, d the shallowest goal depth, m the maximum depth, l the depth limit.
    </p>
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead><tr><th>Algorithm</th><th>Time</th><th>Space</th><th>Complete</th><th>Optimal</th></tr></thead>
        <tbody>
          ${ALGORITHM_REFERENCE.map(([name, ...cells]) => html`
            <tr key=${name}><td>${name}</td>${cells.map((cell, index) => html`<td key=${index}>${cell}</td>`)}</tr>
          `)}
        </tbody>
      </table>
    </div>
  <//>
  `;
}

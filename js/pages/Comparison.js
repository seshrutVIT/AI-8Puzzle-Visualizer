import { Fragment, useState } from 'react';
import { html } from '../html.js';
import { depthLimitedSearch, SearchOutcome } from '../logic/depthLimitedSearch.js';
import { findPuzzleProblem } from '../logic/validatePuzzle.js';

const DEPTH_LIMITS_TO_COMPARE = [3, 5, 8, 10, 12, 15];
const NODE_LIMIT = 1000000;

const OUTCOME_LABEL = {
  [SearchOutcome.FOUND]: 'Yes',
  [SearchOutcome.CUTOFF]: 'No (cutoff)',
  [SearchOutcome.FAILURE]: 'No',
  [SearchOutcome.NODE_LIMIT]: 'Stopped at node limit',
};

export function Comparison({ puzzle }) {
  const [rows, setRows] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const runComparison = () => {
    const { startState, goalState, depthLimit } = puzzle;
    const problem = findPuzzleProblem({ startState, goalState, depthLimit });
    setErrorMessage(problem ?? '');
    if (problem) return;

    setIsRunning(true);
    // Let "Running..." paint before the searches block the page.
    setTimeout(() => {
      setRows(DEPTH_LIMITS_TO_COMPARE.map(limit => ({
        depthLimit: limit,
        result: depthLimitedSearch({ startState, goalState, depthLimit: limit, maxTraceSteps: 0, maxExpandedNodes: NODE_LIMIT }),
      })));
      setIsRunning(false);
    }, 30);
  };

  return html`
    <${Fragment}>
    <h2 className="page-title">Comparison</h2>
    <p className="mb-3 max-w-2xl">
      The assignment gives each student one algorithm, so this page compares DLS itself on the current puzzle at different
      depth limits. Every number is measured in your browser, and each run stops at 1,000,000 expanded nodes.
    </p>
    <button className="btn btn-primary mb-2" onClick=${runComparison} disabled=${isRunning}>Run comparison on current puzzle</button>
    <p className="mb-4 min-h-6 font-semibold text-danger" role="alert">${errorMessage}</p>

    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Depth limit</th><th>Solution found</th><th>Nodes generated</th><th>Nodes expanded</th>
            <th>Moves</th><th>Time</th><th>Memory (approx.)</th>
          </tr>
        </thead>
        <tbody>
          ${isRunning && html`<tr><td colSpan=${7}>Running...</td></tr>`}
          ${!isRunning && rows.map(({ depthLimit, result }) => html`
            <tr key=${depthLimit}>
              <td>${depthLimit}</td>
              <td>${OUTCOME_LABEL[result.outcome]}</td>
              <td>${result.nodesGenerated}</td>
              <td>${result.nodesExpanded}</td>
              <td>${result.solutionPath ? result.solutionPath.length - 1 : '-'}</td>
              <td>${result.elapsedMilliseconds.toFixed(2)} ms</td>
              <td>${result.approxMemoryKilobytes.toFixed(1)} KB</td>
            </tr>
          `)}
        </tbody>
      </table>
    </div>
    <p className="hint mt-3 max-w-2xl">
      A small limit can end in a cutoff with no solution. A large limit finds a solution, but it may be longer than the
      shortest one because DLS is not optimal.
    </p>
  <//>
  `;
}

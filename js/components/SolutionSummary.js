import { html } from '../html.js';
import { SearchOutcome } from '../logic/depthLimitedSearch.js';
import { LabelledValues } from './LabelledValues.js';

const OUTCOME_DESCRIPTION = {
  [SearchOutcome.FOUND]: 'Solution found',
  [SearchOutcome.CUTOFF]: 'Solution not found: the depth limit stopped the search, so the goal may lie deeper',
  [SearchOutcome.FAILURE]: 'Solution not found: every reachable state was searched',
  [SearchOutcome.NODE_LIMIT]: 'Stopped at the 2,000,000 node safety limit',
};

export function SolutionSummary({ result, playbackWasTruncated, maxTraceSteps }) {
  const moveCount = result.solutionPath ? result.solutionPath.length - 1 : '-';
  const rows = [
    { label: 'Result', value: OUTCOME_DESCRIPTION[result.outcome] },
    { label: 'Total number of moves', value: moveCount },
    { label: 'Total nodes generated', value: result.nodesGenerated },
    { label: 'Total nodes expanded', value: result.nodesExpanded },
    { label: 'Maximum search depth', value: result.maxDepthReached },
    { label: 'Execution time', value: `${result.elapsedMilliseconds.toFixed(2)} ms` },
    { label: 'Path cost', value: moveCount },
    { label: 'Memory usage (approx.)', value: `${result.approxMemoryKilobytes.toFixed(1)} KB, peak frontier ${result.peakFrontierSize} nodes` },
  ];
  if (playbackWasTruncated) {
    rows.push({ label: 'Note', value: `Playback shows the first ${maxTraceSteps} expansions. The totals above cover the whole search.` });
  }
  return html`<${LabelledValues} rows=${rows} />`;
}

import { html } from '../html.js';
import { formatState } from '../logic/puzzle.js';
import { LabelledValues } from './LabelledValues.js';

/** Live numbers for the node being expanded. Shown while a search frame is on screen. */
export function SearchDetails({ step }) {
  const frontierPreview = step.frontierTopStates.map(formatState).join(', ') || 'empty';

  return html`
    <${LabelledValues}
      rows=${[
        { label: 'Current node', value: formatState(step.state), monospace: true },
        { label: 'Parent node', value: step.parentState ? formatState(step.parentState) : 'none (root)', monospace: true },
        { label: 'Current search depth', value: step.depth },
        { label: 'Path cost g(n)', value: step.depth },
        { label: 'Nodes generated', value: step.nodesGenerated },
        { label: 'Nodes expanded', value: step.nodesExpanded },
        { label: 'Frontier (stack, top first)', value: `${step.frontierSize} nodes: ${frontierPreview}`, monospace: true },
        { label: 'Explored (closed list)', value: `${step.nodesExpanded} nodes` },
      ]}
    />
  `;
}

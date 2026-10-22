// Depth Limited Search: depth first search that never expands a node deeper than `depthLimit`.
import { BLANK, NEIGHBOUR_CELLS, swapCells } from './puzzle.js';

export const SearchOutcome = {
  FOUND: 'found',
  CUTOFF: 'cutoff',          // the limit stopped some branch, so a deeper goal may exist
  FAILURE: 'failure',        // every reachable state was searched and none is the goal
  NODE_LIMIT: 'node-limit',  // stopped early to keep the browser responsive
};

const APPROX_BYTES_PER_STORED_NODE = 56;
const FRONTIER_PREVIEW_SIZE = 6;

/** A node remembers its parent so the solution path can be rebuilt backwards from the goal. */
const createNode = (state, depth, parent) => ({ state, depth, parent });

/** DLS only rejects repeats on the current path, which is what keeps its memory small. */
function appearsOnPathTo(node, state) {
  for (let ancestor = node; ancestor; ancestor = ancestor.parent) {
    if (ancestor.state === state) return true;
  }
  return false;
}

function generateSuccessors(node) {
  const blankCell = node.state.indexOf(BLANK);
  const successors = [];
  for (const tileCell of NEIGHBOUR_CELLS[blankCell]) {
    const successorState = swapCells(node.state, blankCell, tileCell);
    if (!appearsOnPathTo(node, successorState)) {
      successors.push(createNode(successorState, node.depth + 1, node));
    }
  }
  return successors;
}

function buildPathTo(goalNode) {
  const path = [];
  for (let node = goalNode; node; node = node.parent) path.unshift(node.state);
  return path;
}

/**
 * @param maxTraceSteps     how many expansions to record for the step by step playback
 * @param maxExpandedNodes  safety stop so a large limit cannot freeze the page
 * @returns the outcome, the solution path (or null), the statistics, and the recorded trace
 */
export function depthLimitedSearch({ startState, goalState, depthLimit, maxTraceSteps, maxExpandedNodes }) {
  const startTime = performance.now();
  const frontier = [createNode(startState, 0, null)]; // used as a stack: last in, first out
  const trace = [];

  let nodesGenerated = 1;
  let nodesExpanded = 0;
  let maxDepthReached = 0;
  let peakFrontierSize = 1;
  let depthLimitWasHit = false;
  let hitNodeLimit = false;
  let goalNode = null;

  while (frontier.length > 0) {
    const node = frontier.pop();
    nodesExpanded++;
    maxDepthReached = Math.max(maxDepthReached, node.depth);

    let successors = [];
    if (node.state === goalState) {
      goalNode = node;
    } else if (node.depth < depthLimit) {
      successors = generateSuccessors(node);
      nodesGenerated += successors.length;
      // Pushed in reverse so the first move (Up) is popped, and therefore tried, first.
      for (let i = successors.length - 1; i >= 0; i--) frontier.push(successors[i]);
    } else {
      depthLimitWasHit = true;
    }

    peakFrontierSize = Math.max(peakFrontierSize, frontier.length);

    if (trace.length < maxTraceSteps) {
      trace.push({
        state: node.state,
        depth: node.depth,
        parentState: node.parent ? node.parent.state : null,
        nodesGenerated,
        nodesExpanded,
        successorStates: successors.map(successor => successor.state),
        frontierSize: frontier.length,
        frontierTopStates: frontier.slice(-FRONTIER_PREVIEW_SIZE).reverse().map(entry => entry.state),
      });
    }

    if (goalNode) break;
    if (nodesExpanded >= maxExpandedNodes) {
      hitNodeLimit = true;
      break;
    }
  }

  return {
    outcome: goalNode ? SearchOutcome.FOUND
      : hitNodeLimit ? SearchOutcome.NODE_LIMIT
      : depthLimitWasHit ? SearchOutcome.CUTOFF
      : SearchOutcome.FAILURE,
    solutionPath: goalNode ? buildPathTo(goalNode) : null,
    nodesGenerated,
    nodesExpanded,
    maxDepthReached,
    peakFrontierSize,
    elapsedMilliseconds: performance.now() - startTime,
    approxMemoryKilobytes: ((peakFrontierSize + maxDepthReached) * APPROX_BYTES_PER_STORED_NODE) / 1024,
    trace,
  };
}

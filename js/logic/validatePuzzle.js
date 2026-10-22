import { isGoalReachable, isValidState } from './puzzle.js';

export const MAX_DEPTH_LIMIT = 30;

/** Returns a message describing the first problem found, or null when the puzzle can be run. */
export function findPuzzleProblem({ startState, goalState, depthLimit }) {
  if (!isValidState(startState) || !isValidState(goalState)) {
    return 'Each state needs the digits 1 to 8 once, plus exactly one blank.';
  }
  if (!isGoalReachable(startState, goalState)) {
    return 'This goal cannot be reached from this start state. Change one of the two states.';
  }
  if (!Number.isInteger(depthLimit) || depthLimit < 0 || depthLimit > MAX_DEPTH_LIMIT) {
    return `The depth limit must be a whole number from 0 to ${MAX_DEPTH_LIMIT}.`;
  }
  return null;
}

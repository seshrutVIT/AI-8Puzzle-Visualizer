import { useState } from 'react';
import { DEFAULT_GOAL_STATE, DEFAULT_START_STATE, cellsToState, stateToCells } from '../logic/puzzle.js';

/**
 * The puzzle the user is working on. Cells are kept exactly as typed so half finished input
 * is never rewritten; `startState` and `goalState` are the same cells read as puzzle states.
 */
export function usePuzzleSettings() {
  const [startCells, setStartCells] = useState(stateToCells(DEFAULT_START_STATE));
  const [goalCells, setGoalCells] = useState(stateToCells(DEFAULT_GOAL_STATE));
  const [depthLimitText, setDepthLimitText] = useState('8');

  return {
    startCells, goalCells, depthLimitText,
    setStartCells, setGoalCells, setDepthLimitText,
    startState: cellsToState(startCells),
    goalState: cellsToState(goalCells),
    depthLimit: Number(depthLimitText.trim() === '' ? NaN : depthLimitText),
  };
}

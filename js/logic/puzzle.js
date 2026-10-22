// The rules of the 8-puzzle, independent of React and of any search algorithm.
// A puzzle state is a 9 character string read row by row. '0' stands for the blank.

export const BLANK = '0';
export const BOARD_WIDTH = 3;
export const CELL_COUNT = BOARD_WIDTH * BOARD_WIDTH;

export const DEFAULT_START_STATE = '283164705';
export const DEFAULT_GOAL_STATE = '123804765';

/** The cells a blank at `cellIndex` can swap with, in the order Up, Down, Left, Right. */
function neighbourCellsOf(cellIndex) {
  const row = Math.floor(cellIndex / BOARD_WIDTH);
  const column = cellIndex % BOARD_WIDTH;
  const neighbours = [];
  if (row > 0) neighbours.push(cellIndex - BOARD_WIDTH);
  if (row < BOARD_WIDTH - 1) neighbours.push(cellIndex + BOARD_WIDTH);
  if (column > 0) neighbours.push(cellIndex - 1);
  if (column < BOARD_WIDTH - 1) neighbours.push(cellIndex + 1);
  return neighbours;
}

export const NEIGHBOUR_CELLS = Array.from({ length: CELL_COUNT }, (_, cell) => neighbourCellsOf(cell));

export function isValidState(state) {
  return state.length === CELL_COUNT && [...state].sort().join('') === '012345678';
}

export function swapCells(state, firstIndex, secondIndex) {
  const cells = [...state];
  [cells[firstIndex], cells[secondIndex]] = [cells[secondIndex], cells[firstIndex]];
  return cells.join('');
}

/** Pairs of tiles in the wrong order, ignoring the blank. */
function countInversions(state) {
  let inversions = 0;
  for (let first = 0; first < CELL_COUNT; first++) {
    for (let second = first + 1; second < CELL_COUNT; second++) {
      const bothAreTiles = state[first] !== BLANK && state[second] !== BLANK;
      if (bothAreTiles && state[first] > state[second]) inversions++;
    }
  }
  return inversions;
}

/**
 * On a board of odd width every move keeps the parity of the inversion count,
 * so the goal is reachable exactly when both states share that parity.
 */
export function isGoalReachable(startState, goalState) {
  return countInversions(startState) % 2 === countInversions(goalState) % 2;
}

/** Which way the blank travelled between two neighbouring states. */
export function describeBlankMove(previousState, nextState) {
  const shift = nextState.indexOf(BLANK) - previousState.indexOf(BLANK);
  const directionByShift = { [-BOARD_WIDTH]: 'Up', [BOARD_WIDTH]: 'Down', '-1': 'Left', 1: 'Right' };
  return directionByShift[shift];
}

/** Scrambling the goal with random moves always produces a solvable start state. */
export function generateSolvableStart(goalState, moveCount = 8) {
  let state;
  do {
    state = goalState;
    let previousBlankCell = -1;
    for (let move = 0; move < moveCount; move++) {
      const blankCell = state.indexOf(BLANK);
      const choices = NEIGHBOUR_CELLS[blankCell].filter(cell => cell !== previousBlankCell);
      const chosenCell = choices[Math.floor(Math.random() * choices.length)];
      state = swapCells(state, blankCell, chosenCell);
      previousBlankCell = blankCell;
    }
  } while (state === goalState); // a scramble that undoes itself would give a solved puzzle
  return state;
}

/** "283164705" becomes "283 164 7_5" for display in text. */
export function formatState(state) {
  return state.replace(BLANK, '_').replace(/(...)(?=.)/g, '$1 ');
}

// ---- Converting between what the user types and a state ----

/** Typed cells such as ['2', '', '_'] become a state string; empty and '_' mean the blank. */
export function cellsToState(cells) {
  return cells.map(cell => (cell.trim() === '' || cell.trim() === '_' ? BLANK : cell.trim())).join('');
}

export function stateToCells(state) {
  return [...state].map(tile => (tile === BLANK ? '_' : tile));
}

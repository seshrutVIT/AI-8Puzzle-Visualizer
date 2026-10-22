// Turns a finished search into the list of screens the user steps through:
// first one frame per expansion, then one frame per move of the solution path.

export function buildPlaybackFrames(result) {
  const searchFrames = result.trace.map((step, index) => ({
    kind: 'search',
    state: step.state,
    step,
    stepNumber: index + 1,
  }));

  const path = result.solutionPath ?? [];
  const solutionFrames = path.map((state, moveNumber) => ({
    kind: 'solution',
    state,
    moveNumber,
    previousState: path[moveNumber - 1] ?? null,
    totalMoves: path.length - 1,
  }));

  return [...searchFrames, ...solutionFrames];
}

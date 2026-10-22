import { Fragment, useState } from 'react';
import { html } from '../html.js';
import { FadeIn } from '../animation.js';
import { depthLimitedSearch } from '../logic/depthLimitedSearch.js';
import { buildPlaybackFrames } from '../logic/playbackFrames.js';
import { describeBlankMove, generateSolvableStart, isValidState, stateToCells } from '../logic/puzzle.js';
import { findPuzzleProblem, MAX_DEPTH_LIMIT } from '../logic/validatePuzzle.js';
import { usePlayback } from '../hooks/usePlayback.js';
import { Board } from '../components/Board.js';
import { Controls } from '../components/Controls.js';
import { MiniBoard } from '../components/MiniBoard.js';
import { SearchDetails } from '../components/SearchDetails.js';
import { SolutionSummary } from '../components/SolutionSummary.js';
import { StateGrid } from '../components/StateGrid.js';

const MAX_TRACE_STEPS = 1500;
const MAX_EXPANDED_NODES = 2000000;
const MAX_TILE_SLIDE_SECONDS = 0.3;

/** Speed 1 is slowest (920 ms per step) and speed 10 is fastest (20 ms per step). */
const stepDelayFor = speed => 1020 - 100 * speed;

function describeFrame(frame, searchStepCount) {
  if (!frame) return 'Press Run or Next Step to begin.';
  if (frame.kind === 'search') {
    return `Search step ${frame.stepNumber} of ${searchStepCount}: expanding a node at depth ${frame.step.depth}`;
  }
  const position = `Solution path, step ${frame.moveNumber} of ${frame.totalMoves}`;
  return frame.moveNumber === 0
    ? `${position}: start state`
    : `${position}: blank moves ${describeBlankMove(frame.previousState, frame.state)}`;
}

export function Solver({ puzzle }) {
  const { startCells, goalCells, depthLimitText, startState, goalState, depthLimit } = puzzle;
  const [run, setRun] = useState(null); // { result, frames } for the puzzle as it was when Run was pressed
  const [errorMessage, setErrorMessage] = useState('');
  const [speed, setSpeed] = useState(6);

  const stepDelay = stepDelayFor(speed);
  const playback = usePlayback(run ? run.frames.length : 0, stepDelay);

  const currentFrame = run && playback.frameIndex >= 0 ? run.frames[playback.frameIndex] : null;
  const currentSearchStep = currentFrame?.kind === 'search' ? currentFrame.step : null;
  const boardState = currentFrame ? currentFrame.state : isValidState(startState) ? startState : null;
  const slideSeconds = Math.min((stepDelay * 0.8) / 1000, MAX_TILE_SLIDE_SECONDS);

  const playbackWasTruncated = run !== null && run.result.trace.length >= MAX_TRACE_STEPS;
  const hasReachedSolutionFrames = run !== null && playback.frameIndex >= run.result.trace.length;

  /** Any edit to the puzzle makes a finished run stale, so it is thrown away. */
  const discardRun = () => {
    playback.reset();
    setRun(null);
  };
  const editPuzzle = setter => value => {
    setter(value);
    discardRun();
  };

  /** Validates the inputs and runs the search. Returns the new run, or null if the inputs are invalid. */
  const createRun = () => {
    const problem = findPuzzleProblem({ startState, goalState, depthLimit });
    setErrorMessage(problem ?? '');
    if (problem) return null;

    const result = depthLimitedSearch({
      startState, goalState, depthLimit,
      maxTraceSteps: MAX_TRACE_STEPS,
      maxExpandedNodes: MAX_EXPANDED_NODES,
    });
    const newRun = { result, frames: buildPlaybackFrames(result) };
    setRun(newRun);
    return newRun;
  };

  const handleRun = () => {
    if (createRun()) playback.playFromStart();
  };
  const handleResume = () => {
    if (run && !playback.isAtLastFrame) playback.resume();
  };
  const handleNext = () => {
    playback.pause();
    if (run) playback.stepForward();
    else if (createRun()) playback.jumpTo(0);
  };
  const handlePrevious = () => {
    playback.pause();
    playback.stepBack();
  };
  const handleGenerateRandom = () => {
    if (!isValidState(goalState)) {
      setErrorMessage('Fix the goal state first, then generate a puzzle.');
      return;
    }
    setErrorMessage('');
    puzzle.setStartCells(stateToCells(generateSolvableStart(goalState)));
    discardRun();
  };

  return html`
    <${Fragment}>
    <h2 className="page-title">Solver</h2>

    <div className="mb-4 grid gap-4 lg:grid-cols-2">
      <section className="card">
        <h3 className="section-title">1. Puzzle input</h3>
        <div className="flex flex-wrap gap-6">
          <${StateGrid} title="Start state" cells=${startCells} onChange=${editPuzzle(puzzle.setStartCells)} />
          <${StateGrid} title="Goal state" cells=${goalCells} onChange=${editPuzzle(puzzle.setGoalCells)} />
        </div>
        <p className="hint my-3">Type the digits 1 to 8. Use _, 0 or an empty box for the blank.</p>
        <button className="btn" onClick=${handleGenerateRandom}>Generate Random Puzzle</button>

        <h3 className="section-title mt-6">2. Algorithm</h3>
        <label className="my-2 flex items-center gap-3">
          Algorithm
          <select className="field" disabled><option>Depth Limited Search (DLS)</option></select>
        </label>
        <label className="my-2 flex items-center gap-3">
          Depth limit
          <input
            className="field w-20"
            type="number" min="0" max=${MAX_DEPTH_LIMIT}
            value=${depthLimitText}
            onChange=${event => editPuzzle(puzzle.setDepthLimitText)(event.target.value)}
          />
        </label>
        <p className="hint">DLS is uninformed, so it uses no heuristic. Moves are tried in the order Up, Down, Left, Right, as seen from the blank.</p>
        <p className="mt-2 min-h-6 font-semibold text-danger" role="alert">${errorMessage}</p>
      </section>

      <section className="card">
        <h3 className="section-title">3. Puzzle visualization</h3>
        <div className="flex flex-wrap items-start gap-5">
          <div className="w-72 max-w-full">
            <${Board} state=${boardState} goalState=${goalState} slideSeconds=${slideSeconds} />
            <p className="mt-2 font-semibold">${describeFrame(currentFrame, run?.result.trace.length)}</p>
          </div>
          <div className="space-y-3">
            <div><h4 className="mb-1 font-heading">Start</h4>${isValidState(startState) && html`<${MiniBoard} state=${startState} />`}</div>
            <div><h4 className="mb-1 font-heading">Goal</h4>${isValidState(goalState) && html`<${MiniBoard} state=${goalState} isGoal />`}</div>
          </div>
        </div>

        <h4 className="mb-1 mt-4 font-heading">Generated successor states</h4>
        <div className="flex min-h-12 flex-wrap gap-2">
          ${currentSearchStep?.successorStates.map(state => html`
            <${FadeIn} key=${`${currentFrame.stepNumber}-${state}`}><${MiniBoard} state=${state} /><//>
          `)}
          ${currentSearchStep?.successorStates.length === 0 && html`
            <p className="hint">No successors were generated. The node is the goal, sits at the depth limit, or every move repeats a state on its path.</p>
          `}
        </div>

        <${Controls}
          isPlaying=${playback.isPlaying}
          speed=${speed} onSpeedChange=${setSpeed}
          onRun=${handleRun} onPause=${playback.pause} onResume=${handleResume}
          onPrevious=${handlePrevious} onNext=${handleNext} onReset=${discardRun}
        />
      </section>
    </div>

    <div className="mb-4 grid gap-4 lg:grid-cols-2">
      <section className="card">
        <h3 className="section-title">4. Search process</h3>
        ${currentSearchStep && html`<${SearchDetails} step=${currentSearchStep} />`}
      </section>
      <section className="card">
        <h3 className="section-title">5. Solution summary</h3>
        ${run && playback.isAtLastFrame
          ? html`<${SolutionSummary} result=${run.result} playbackWasTruncated=${playbackWasTruncated} maxTraceSteps=${MAX_TRACE_STEPS} />`
          : html`<p className="hint">Shown when the playback reaches the end.</p>`}
      </section>
    </div>

    <section className="card">
      <h3 className="section-title">Final solution path</h3>
      <div className="flex flex-wrap gap-2">
        ${hasReachedSolutionFrames && run.result.solutionPath
          ? run.result.solutionPath.map((state, moveNumber, path) => html`
              <${MiniBoard} key=${moveNumber} state=${state} caption=${moveNumber} isGoal=${moveNumber === path.length - 1} />
            `)
          : html`<p className="hint">The path appears once the playback reaches the solution.</p>`}
      </div>
    </section>
  <//>
  `;
}

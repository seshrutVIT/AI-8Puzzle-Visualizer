import { Fragment } from 'react';
import { html } from '../html.js';
import { LabelledValues } from '../components/LabelledValues.js';
import { STUDENT_DETAILS } from '../content/algorithmInfo.js';

export function Home() {
  return html`
    <${Fragment}>
    <h1 className="page-title page-title-large max-w-xl">Solving the 8-Puzzle with Depth Limited Search</h1>
    <p className="mb-5 max-w-2xl text-lg">
      Enter or generate a puzzle, set a depth limit, and watch the search expand nodes one at a time until it reaches the goal or hits the limit.
    </p>
    <div className="mb-6 max-w-3xl"><${LabelledValues} rows=${STUDENT_DETAILS} /></div>

    <h2 className="section-title">The 8-Puzzle problem</h2>
    <div className="max-w-2xl space-y-3">
      <p>The puzzle is a 3 by 3 board holding tiles 1 to 8 and one blank. A move slides a neighbouring tile into the blank, which is the same as moving the blank up, down, left or right. The task is to turn a given start arrangement into a goal arrangement using as few moves as possible.</p>
      <p>As a search problem, a state is one arrangement of the board, the successor function returns the states reachable with one blank move, each move costs 1, and the goal test compares the board with the goal state. Only half of all arrangements can reach a given goal, so the solver checks solvability before it runs.</p>
    </div>
    <a className="btn btn-primary mt-5 inline-block" href="#solver">Open the solver</a>
  <//>
  `;
}

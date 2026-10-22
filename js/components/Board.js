import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { html } from '../html.js';
import { prefersReducedMotion } from '../animation.js';
import { BOARD_WIDTH } from '../logic/puzzle.js';

const TILE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
const UNSET_BOARD = '123456780';

/**
 * The large animated board. All eight tiles stay on screen and GSAP moves each one to its cell,
 * so when the blank changes place the tile that filled it visibly slides across.
 * A tile already in its goal cell is drawn green. `state` is null when the input is not a valid puzzle.
 */
export function Board({ state, goalState, slideSeconds }) {
  const tileElements = useRef({});
  const tilesArePlaced = useRef(false);
  const isShowingState = state !== null;
  const shownState = state ?? UNSET_BOARD;

  useEffect(() => {
    // The first placement is instant; later ones slide.
    const duration = tilesArePlaced.current && !prefersReducedMotion() ? slideSeconds : 0;
    TILE_NUMBERS.forEach(tileNumber => {
      const cellIndex = shownState.indexOf(String(tileNumber));
      gsap.to(tileElements.current[tileNumber], {
        xPercent: (cellIndex % BOARD_WIDTH) * 100,
        yPercent: Math.floor(cellIndex / BOARD_WIDTH) * 100,
        duration,
        ease: 'power2.inOut',
        overwrite: true,
      });
    });
    tilesArePlaced.current = true;
  }, [shownState, slideSeconds]);

  return html`
    <div className=${`relative aspect-square rounded border-2 border-ink bg-blank ${isShowingState ? '' : 'opacity-40'}`}>
      ${TILE_NUMBERS.map(tileNumber => {
        const cellIndex = shownState.indexOf(String(tileNumber));
        const isInGoalCell = isShowingState && goalState?.[cellIndex] === String(tileNumber);
        return html`
          <div
            key=${tileNumber}
            ref=${element => { tileElements.current[tileNumber] = element; }}
            className="absolute left-0 top-0 h-1/3 w-1/3"
          >
            <div className=${`absolute inset-1 grid place-items-center rounded font-heading text-3xl text-white ${isInGoalCell ? 'bg-goal' : 'bg-accent'}`}>
              ${tileNumber}
            </div>
          </div>
        `;
      })}
    </div>
  `;
}

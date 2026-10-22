import { useEffect, useState } from 'react';

/**
 * Tracks which frame is on screen. `frameIndex` -1 means nothing has been played yet.
 * While playing, a timer advances one frame per `stepDelayMilliseconds`.
 */
export function usePlayback(frameCount, stepDelayMilliseconds) {
  const [frameIndex, setFrameIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastFrameIndex = frameCount - 1;

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (frameIndex >= lastFrameIndex) {
      setIsPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setFrameIndex(index => index + 1), stepDelayMilliseconds);
    return () => clearTimeout(timer);
  }, [isPlaying, frameIndex, lastFrameIndex, stepDelayMilliseconds]);

  return {
    frameIndex,
    isPlaying,
    isAtLastFrame: frameCount > 0 && frameIndex >= lastFrameIndex,
    playFromStart: () => { setFrameIndex(-1); setIsPlaying(true); },
    resume: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    stepForward: () => setFrameIndex(index => Math.min(index + 1, lastFrameIndex)),
    stepBack: () => setFrameIndex(index => Math.max(index - 1, -1)),
    jumpTo: index => setFrameIndex(index),
    reset: () => { setIsPlaying(false); setFrameIndex(-1); },
  };
}

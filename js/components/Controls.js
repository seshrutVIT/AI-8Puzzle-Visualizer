import { html } from '../html.js';

export function Controls({ isPlaying, speed, onSpeedChange, onRun, onPause, onResume, onPrevious, onNext, onReset }) {
  return html`
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-rule pt-4">
      <button className="btn btn-primary" onClick=${onRun}>Run</button>
      <button className="btn" onClick=${onPause} disabled=${!isPlaying}>Pause</button>
      <button className="btn" onClick=${onResume} disabled=${isPlaying}>Resume</button>
      <button className="btn" onClick=${onPrevious}>Previous Step</button>
      <button className="btn" onClick=${onNext}>Next Step</button>
      <button className="btn" onClick=${onReset}>Reset</button>
      <label className="ml-2 flex items-center gap-2">
        Speed
        <input type="range" min="1" max="10" value=${speed} onChange=${event => onSpeedChange(Number(event.target.value))} />
      </label>
    </div>
  `;
}

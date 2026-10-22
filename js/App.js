import { html } from './html.js';
import { useHashPage } from './hooks/useHashPage.js';
import { usePuzzleSettings } from './hooks/usePuzzleSettings.js';
import { Home } from './pages/Home.js';
import { Solver } from './pages/Solver.js';
import { Comparison } from './pages/Comparison.js';
import { AlgorithmInfo } from './pages/AlgorithmInfo.js';

const NAVIGATION = [
  { id: 'home', label: 'Home' },
  { id: 'solver', label: 'Solver' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'info', label: 'Algorithm Info' },
];

/** Hidden pages stay mounted, so a half finished run survives a trip to another page. */
function Page({ id, activePage, children }) {
  return html`<section className=${id === activePage ? '' : 'hidden'}>${children}</section>`;
}

export function App() {
  const activePage = useHashPage(NAVIGATION.map(page => page.id), 'home');
  const puzzle = usePuzzleSettings();

  return html`
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 flex flex-wrap items-center gap-x-8 gap-y-2 bg-ink px-5 py-3">
        <a className="font-heading text-lg font-bold text-white" href="#home">8-Puzzle DLS</a>
        <nav className="flex flex-wrap gap-5 text-white">
          ${NAVIGATION.map(({ id, label }) => html`
            <a key=${id} href=${`#${id}`} className=${`border-b-2 ${id === activePage ? 'border-sky-300' : 'border-transparent'}`}>${label}</a>
          `)}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <${Page} id="home" activePage=${activePage}><${Home} /><//>
        <${Page} id="solver" activePage=${activePage}><${Solver} puzzle=${puzzle} /><//>
        <${Page} id="comparison" activePage=${activePage}><${Comparison} puzzle=${puzzle} /><//>
        <${Page} id="info" activePage=${activePage}><${AlgorithmInfo} /><//>
      </main>

      <footer className="border-t border-rule p-5 text-center text-muted">
        Seshrut Jain | 24BAI0117 | Artificial Intelligence | Depth Limited Search
      </footer>
    </div>
  `;
}

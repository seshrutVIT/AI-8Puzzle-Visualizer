# AI-8Puzzle-Visualizer

## Project Description
An interactive web application that solves the 8-Puzzle problem with Depth Limited Search (DLS) and shows how the search works, one step at a time.

The user can type an initial and goal state or generate a random solvable puzzle, set a depth limit, and then run the search. While it runs, the page shows:

- the current board, with the blank tile's movement animated
- the node being expanded and the successor states it generates
- nodes generated and expanded, current depth, parent node, path cost, the frontier (stack) and the explored count
- the final solution path and a summary (moves, nodes generated and expanded, maximum depth, execution time, path cost, approximate memory)

Playback has Run, Pause, Resume, Next Step, Previous Step, Reset and a speed control. A comparison page runs DLS on the current puzzle at several depth limits, and an information page documents the algorithm.

Course: Artificial Intelligence. Assignment: Interactive 8-Puzzle Problem Solver using AI Search Algorithms (Case Study).

## Technologies Used
- HTML5, CSS3, JavaScript (ES6)
- React 18, built with Vite
- Tailwind CSS (UI framework)
- Framer Motion (animation library for tile movement and successor states)
- GitHub Actions and GitHub Pages (deployment)

## Search Algorithms Implemented
**Depth Limited Search (DLS)**, written from scratch in `src/logic/depthLimitedSearch.js`.

- Uses an explicit stack, so the most recently generated node is expanded first.
- Tests for the goal when a node is expanded.
- Does not expand nodes at the depth limit.
- Skips successors that already appear on the current path, which avoids loops without storing every visited state.
- Ends with one of four results: solution found, cutoff (the limit stopped the search, so a deeper goal may exist), failure (the whole space was searched), or a safety stop at 2,000,000 expanded nodes.

DLS is not optimal, so the path it returns can be longer than the shortest one. It is complete only when the depth limit is at least the depth of the shallowest goal.

## Heuristics Used
None. DLS is an uninformed search, so heuristics such as Misplaced Tiles and Manhattan Distance do not apply to it. They belong to the informed searches (GBFS and A*), which are assigned to other students.

## Screenshots
Home page:

![Home page](home.png)

Solver with search in progress:

![Solver](solver.png)

Solution summary and path:

![Solution](solution.png)

Comparison page:

![Comparison](comparison.png)

Algorithm page:
![Algorithm](algo.png)

## GitHub Pages URL
https://seshrutVIT.github.io/AI-8Puzzle-Visualizer

## Student Details
| | |
|---|---|
| Name | Seshrut Jain |
| Registration number | 24BAI0117 |
| Course | Artificial Intelligence |
| Assigned algorithm | 3, Depth Limited Search |

## References
- S. Russell and P. Norvig, *Artificial Intelligence: A Modern Approach*, chapter 3, Solving Problems by Searching.
- React documentation, https://react.dev
- Vite documentation, https://vite.dev
- Tailwind CSS documentation, https://tailwindcss.com/docs
- Framer Motion documentation, https://motion.dev
- GitHub Pages documentation, https://docs.github.com/pages

The search algorithm, puzzle logic and interface code are original work for this assignment. No other third-party code or images are used.

## How to Run the Project
Requires Node.js 18 or newer.

```
git clone https://github.com/seshrutVIT/AI-8Puzzle-Visualizer.git
cd AI-8Puzzle-Visualizer
npm install
npm run dev
```

Open the address printed in the terminal (usually http://localhost:5173).

To create a production build, run `npm run build`. The output goes to `dist/`, and `npm run preview` serves it locally.

**Deploying to GitHub Pages:** push the repository to GitHub, open Settings > Pages, and set Source to GitHub Actions. The workflow in `.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

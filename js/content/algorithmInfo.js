// Text for the Home and Algorithm Information pages, kept apart from the components that show it.

export const STUDENT_DETAILS = [
  { label: 'Course', value: 'Artificial Intelligence' },
  { label: 'Assignment', value: 'Interactive 8-Puzzle Problem Solver using AI Search Algorithms (Case Study)' },
  { label: 'Student name', value: 'Seshrut Jain' },
  { label: 'Registration number', value: '24BAI0117' },
  { label: 'Assigned algorithm', value: 'Depth Limited Search (DLS)' },
];

export const DLS_DETAILS = [
  { label: 'Description', value: 'Depth first search with a fixed depth limit l. Nodes at depth l are not expanded, which stops the search from running down an endless branch.' },
  { label: 'Working principle', value: 'Push the start node on a stack. Pop a node and test it against the goal. If its depth is below l, push its successors that are not already on its own path. If the stack empties, report a cutoff when some node hit the limit, or failure otherwise.' },
  { label: 'Advantages', value: 'Needs little memory, always terminates, and is simple to implement.' },
  { label: 'Limitations', value: 'Finds nothing if the goal is deeper than l. May return a long path when a shorter one exists. A good l needs knowledge of the problem. Repeated states that are not on the current path are not detected.' },
  { label: 'Time complexity', value: 'O(b^l), where b is the branching factor (at most 4 for the 8-puzzle).' },
  { label: 'Space complexity', value: 'O(b*l)' },
  { label: 'Completeness', value: 'Not complete in general. Complete when l is at least the depth of the shallowest goal.' },
  { label: 'Optimality', value: 'Not optimal, even when l is large enough.' },
];

// Standard textbook properties for unit step costs.
export const ALGORITHM_REFERENCE = [
  ['BFS', 'O(b^d)', 'O(b^d)', 'Yes', 'Yes'],
  ['DFS', 'O(b^m)', 'O(b*m)', 'No in infinite or cyclic spaces', 'No'],
  ['DLS (implemented)', 'O(b^l)', 'O(b*l)', 'Only if l >= d', 'No'],
  ['IDDLS', 'O(b^d)', 'O(b*d)', 'Yes', 'Yes'],
  ['Uniform cost', 'O(b^(1+C*/e))', 'O(b^(1+C*/e))', 'Yes', 'Yes'],
  ['GBFS', 'O(b^m) worst case', 'O(b^m) worst case', 'No in cyclic spaces', 'No'],
  ['A*', 'Exponential in solution length', 'Keeps all nodes', 'Yes', 'Yes with an admissible heuristic'],
];

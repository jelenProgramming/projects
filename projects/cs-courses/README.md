# Algorithm Visualizer

An interactive, bilingual (English / German) learning resource that animates the
algorithms, data structures and concepts of **core computer science**, the
universal foundation shared across programs like MIT, Cambridge, TU Graz and
TU München.

Built for the moment a concept finally clicks before an exam: every page leads
with a plain-language **TL;DR** of what the thing actually does and when to reach
for it, then lets you **watch it run step by step** with a narrated explanation of
every move.

> **116 topics across 15 categories, 52 fully interactive visualizers, every page with a complexity table and exam-trap notes.**

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173  - open this to see it
npm run build    # production build -> dist/
```

## Deploy in ~2 minutes

This is a static site (hash routing, relative asset paths) - it works on any host with zero config.

**Vercel (easiest):**
1. `git init && git add -A && git commit -m "init"`, then push to a new GitHub repo.
2. Go to vercel.com -> New Project -> import the repo. It auto-detects Vite (config is in `vercel.json`). Click Deploy.

**Netlify:** drag the `dist/` folder onto app.netlify.com/drop, OR connect the repo (settings are in `netlify.toml`).

**GitHub Pages:** `npm run build`, then publish `dist/` to the `gh-pages` branch. Hash routing means deep links like `/#/algo/dijkstra` work with no redirect rules.

> Before pushing, set your contact links: edit the `CONTACT` block at the top of `src/pages/Info.jsx`.

## Highlights

- **Step-by-step animation** with play / pause / step / speed / scrub controls, and a plain-language description of *what the algorithm just decided* on every step.
- **English ⇄ German** toggle across the entire UI, every explanation, and every animation caption. Code stays in English (the lingua franca).
- **Light / dark theme**, remembered between visits.
- **Best / average / worst complexity** (time and space) on every algorithm and data structure - with notes on *why* the worst case happens.
- **"Trace it on paper" panels** on data structures and key algorithms - how to walk through pointers, linked lists, recursion, DP tables, and union-find by hand for an exam.
- **Exam-relevant detail** baked in: which character drives the shift in Boyer-Moore vs Sunday vs Horspool; the four union-find cases when joining a graph (including "neither endpoint is in a group yet"); the two-matrix (D and P) Floyd-Warshall trace; the ∀ε ∃δ definition shown visually.

## Categories

| Category | Examples |
|---|---|
| **Sorting** | bubble, selection, insertion, merge, quick, heap, counting, radix |
| **Graphs & Pathfinding** | BFS, DFS, Dijkstra (dist/pred arrays), Floyd-Warshall (D & P matrices), Prim, Kruskal, A* |
| **Trees & Structures** | BST, binary heap, trie, linked lists, stack/queue, hash table |
| **Backtracking** | N-Queens, graph coloring, Sudoku |
| **String Algorithms** | naive, KMP, Boyer-Moore, Rabin-Karp, Horspool, Sunday |
| **Dynamic Programming** | edit distance, optimal BST, 0/1 knapsack, TSP |
| **Compression & Coding** | RLE, Huffman, LZW, arithmetic, Shannon-Fano, LZ77/78, Golomb, BWT, suffix structures |
| **Cryptography** | Caesar, Vigenère, Playfair, ADFGX |
| **Divide & Conquer** | binary search, Strassen, the Master Theorem |
| **Discrete Math** | Warshall closure, Euclid & extended Euclid, modular exponentiation, CRT, combinatorics, induction, logic, relations |
| **Calculus Essentials** | ε-δ limits, derivatives, Riemann sums, Taylor series, Newton's method, sequences & series |
| **Programming Concepts** | Big-O, types, control flow, functions, recursion, pointers & memory, OOP, templates |
| **Databases** | relational model, SQL joins, SQL basics, keys & ER model, normalization (1NF-BCNF), B-tree indexes, transactions & ACID |
| **Computer Systems** | number systems, binary arithmetic, logic gates, von Neumann architecture, memory hierarchy, Turing machine, processes & threads |
| **Web Foundations** | how the web works, HTTP, DNS, TCP/IP handshake, cookies & sessions, JSON & XML |

## Tech

- **React 18** + **Vite** - no backend, fully static.
- **React Router** (hash routing, so it deploys to any static host without server config).
- A small shared animation **engine** (`usePlayer`): every algorithm is written as a pure function that produces an array of step snapshots; the player walks through them. Zero animation code lives in the algorithms themselves, which keeps each one small and testable.
- A central **registry** + per-category **content** modules: adding a topic is one registry entry plus a content entry (and, for an interactive one, a small component).
- No runtime dependencies beyond React and the router; charts and graphs are hand-drawn SVG.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs static files to dist/
npm run preview  # preview the production build
```

## Deploy

The build is a plain static site (hash routing, relative asset paths), so it works on any static host.

**Vercel**
1. Push this repo to GitHub.
2. Import it in Vercel. Framework preset: **Vite**. Build command `npm run build`, output directory `dist`. Deploy.

**Netlify**
- Build command `npm run build`, publish directory `dist`.

**GitHub Pages**
```bash
npm run build
# push the dist/ folder to the gh-pages branch (e.g. via the `gh-pages` package)
```
Hash routing means deep links like `/#/algo/dijkstra` work with no extra redirect rules.

## Project structure

```
src/
  registry.js              all topics, categories, course tags (single source of truth)
  content.js               aggregates the per-category content modules
  content/                 bilingual prose: TL;DR, how, complexity, exam traps, paper traces
  engine/usePlayer.js      the shared step-through animation hook
  components/              PlayerControls, StatusBar, ComplexityTable, ReadPage, AlgoDetail, Icons
  algorithms/<category>/   one file per interactive visualizer (+ its pure step generator)
  pages/                   Home and the per-topic page shell
  i18n.jsx                 EN/DE language layer
```

To add an algorithm: add one line to `src/registry.js`, an entry to a file in
`src/content/`, and (for an interactive one) a component at
`src/algorithms/<category>/<slug>.jsx` that renders its visualizer plus
`<AlgoDetail content={content} />`.

## A note on correctness

The pure algorithm functions are covered by a logic test suite (sorting output
verified against a reference sort on multiple inputs including edge cases;
Dijkstra and Floyd-Warshall cross-checked for agreement; MST edge counts; string
matchers verified to find the pattern at the correct index and to report absence
correctly). Every interactive component is also smoke-tested to render without
runtime errors.

## References

The standard algorithms are described in many textbooks; these are the works the
corresponding reference works, listed for further reading (the
explanations and code here are original):

- Cormen, Leiserson, Rivest, Stein - *Introduction to Algorithms* (MIT Press)
- Stroustrup - *A Tour of C++* (Addison-Wesley)
- Salomon & Motta - *Handbook of Data Compression* (Springer)
- Connolly & Begg - *Database Systems* (Pearson); Elmasri & Navathe - *Fundamentals of Database Systems*
- Brookshear - *Computer Science: An Overview* (Addison-Wesley)

Algorithms themselves are not copyrightable; all explanatory text, code and
visualizations in this project are original.

## License

MIT - see `LICENSE`.

# Case 6: Classic Platelet Aggregation

An interactive, framework-free educational module for pathology residents covering light-transmission aggregometry and the diagnostic evaluation of Bernard–Soulier syndrome.

## GitHub Pages deployment

1. Create a new GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.

The module requires no build command, package manager, framework, or server-side code.

## Files

- `index.html` — module content and accessible page structure
- `styles.css` — responsive academic design
- `script.js` — navigation, progress tracking, clinical case, tracing explorer, and quiz
- `assets/` — reserved for future institution-approved educational assets

## Local preview

Open `index.html` directly in a modern browser, or serve this folder with any static web server. Learner progress is stored locally in the browser using `localStorage`.

## Educational scope

This module is intended for education. Agonist concentrations, reference intervals, and laboratory procedures must follow each laboratory's validated method.

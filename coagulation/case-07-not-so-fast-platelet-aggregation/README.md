# Case 7: Not So Fast Platelet Aggregation

Interactive educational module for pathology residents about reversible alcohol-associated platelet dysfunction and light-transmission aggregometry.

## GitHub Pages deployment

1. Create a new GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.

GitHub will display the published site URL after deployment finishes.

## Local preview

Open `index.html` directly in a modern browser. No framework, installation, build step, or web server is required.

## Contents

- `index.html` — single-page educational module
- `styles.css` — responsive academic design
- `script.js` — navigation, progress tracking, agonist explorer, clinical case, and quiz
- `assets/` — module image assets

Learner progress and quiz scores are stored locally in the browser using `localStorage`.

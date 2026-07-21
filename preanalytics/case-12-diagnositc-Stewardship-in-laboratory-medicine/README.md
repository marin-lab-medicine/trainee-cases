# Case 12: Diagnostic Stewardship in Laboratory Medicine

Interactive, framework-free educational module for pathology residents. The
site is fully static and ready for GitHub Pages.

## Run locally

Open `index.html` directly, or serve the directory with any static HTTP server.

For example:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Upload the contents of this folder to the root of a GitHub repository.
2. In the repository, open **Settings > Pages**.
3. Select **Deploy from a branch**.
4. Choose the deployment branch and the `/ (root)` folder, then save.

No build step or external dependency is required.

## Files

- `index.html`: educational content and semantic structure
- `styles.css`: responsive academic design and print styles
- `script.js`: navigation, cases, quiz, and local progress tracking
- `assets/`: reserved for project assets
- `.nojekyll`: prevents unnecessary Jekyll processing on GitHub Pages

Progress is stored in the browser using `localStorage` and can be reset from the sidebar.

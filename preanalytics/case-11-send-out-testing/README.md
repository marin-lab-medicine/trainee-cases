# Case 11: Send-out Testing

Interactive pathology resident learning module built with plain HTML, CSS, and JavaScript.

## Run locally

Open `index.html` in a modern browser. No build step or web server is required.

Progress is stored in the browser with `localStorage`. Use **Reset module progress** in the sidebar to clear it.

## Deploy with GitHub Pages

1. Upload the contents of this folder to the root of a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the publishing branch and the `/ (root)` folder, then save.

The module uses relative paths and requires no build process or external framework.

## Files

- `index.html` — educational content and semantic structure
- `styles.css` — responsive academic interface
- `script.js` — progress, cases, workflow, and quiz behavior
- `assets/references/source-notes.txt` — source and content notes

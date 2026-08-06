# Case 2: Thrombotic Microangiopathy

An interactive pathology resident learning module about thrombotic microangiopathy after solid-organ transplantation. The module covers syndrome recognition, contemporary TMA classification, ADAMTS13 interpretation, PLASMIC scoring, mechanism-directed management, a progressive clinical case, and a knowledge check.

## GitHub Pages deployment

1. Create a new GitHub repository.
2. Upload the contents of this folder to the repository root.
3. Commit the files to the default branch.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**.
6. Select the default branch and the `/ (root)` folder, then save.

GitHub Pages will publish `index.html` as the site homepage.

## Project structure

```text
case-2-tma-github/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
```

The site uses only HTML, CSS, and JavaScript. It has no framework, build step, external dependency, or network requirement. Learning progress is stored locally in the visitor's browser.

## Local use

Open `index.html` in a modern web browser. All site paths are relative, so the module works from a local folder and from a GitHub Pages project URL.

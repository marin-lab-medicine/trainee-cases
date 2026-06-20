# Preanalytical Laboratory Errors: Hemolysis

An interactive educational website for pathology residents focused on hemolysis as a preanalytical laboratory error.

## Contents

- Home page
- Learning objectives
- Hemolysis overview
- Mechanisms of interference
- Interactive clinical cases
- Final quiz with score tracking

## Technology

This project uses only static files:

- HTML
- CSS
- JavaScript

No build step or package installation is required.

## Run Locally

Open `index.html` directly in a browser, or serve the folder with a local static server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## GitHub Pages

To publish with GitHub Pages:

1. Create a new GitHub repository.
2. Upload all files in this folder.
3. In repository settings, go to **Pages**.
4. Choose the branch that contains `index.html`.
5. Set the source folder to the repository root.

GitHub Pages will serve `index.html` as the site homepage.

## File Structure

```text
.
├── index.html
├── styles.css
├── script.js
├── assets/
│   └── hemolysis-gradient.jpeg
├── .gitignore
├── .nojekyll
└── README.md
```


# Hemolysis Case 2 Consultation Simulator

A static educational website for pathology residents on consultation and decision-making for severely hemolyzed laboratory specimens.

## Focus

- Distinguishing in vivo vs ex vivo hemolysis
- Severe hemolysis consultation workflow
- Safe result release vs redraw decisions
- Communication with laboratory staff and clinical teams
- Interactive clinical cases and final quiz

## Files For GitHub Pages

```text
.
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── specimen-brown-dark.svg
│   └── specimen-pink-red.svg
├── .nojekyll
├── .gitignore
└── README.md
```

## Deploy To GitHub Pages

1. Create a new GitHub repository.
2. Upload these root files and the `assets/` folder.
3. In GitHub, open **Settings**.
4. Select **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Choose the `main` branch and `/root` folder.
7. Save. GitHub will publish the site after the Pages workflow completes.

## Run Locally

Open `index.html` directly in a browser.

Optional local server:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000/
```

## Technical Notes

This site has no framework, no build step, and no external dependencies. It uses plain HTML, CSS, JavaScript, and local SVG placeholders.

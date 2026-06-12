# NPC Dialogue Game: AI Talk

A browser-based NPC conversation game with a retro pixel look and an in-browser AI model for dialogue.

## What It Does

- Lets you talk to multiple NPCs in character
- Uses a downloadable AI text model in the browser
- Keeps a short conversation memory for each NPC
- Tracks simple trust and mood values
- Works as a static GitHub Pages site

## How to Use It

1. Open `index.html` in a browser.
2. Wait for the AI model to load.
3. Type a message and press Talk.
4. Switch NPCs with the character buttons.

## AI Model

The page loads a small Transformers.js text-generation model from a CDN.
The first visit may take a little while while the model downloads.
If the model cannot load, the game falls back to local dialogue so the page still works.

## Deployment

For GitHub Pages, keep these files at the repository root:

- `index.html`
- `style.css`
- `game.js`

Then enable Pages from the `main` branch or deploy with the included workflow.

## Notes

- The old Python CLI version has been removed.
- The game now runs entirely in the browser.
- If you want to host your own model endpoint later, `game.js` is the place to swap in a different provider.

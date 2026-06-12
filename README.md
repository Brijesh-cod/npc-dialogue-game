# NPC Dialogue Game

An interactive role-playing game where you engage in realistic conversations with NPCs. The project now includes a retro-styled browser prototype and a Python CLI version, both centered on personality-driven dialogue, memory, trust, and branching interactions.

## Features

### Browser Prototype
- Retro pixel-art UI with a static HTML/CSS presentation
- Branching dialogue concepts and inventory/trust framing
- GitHub Pages friendly structure with `index.html` at the repo root

### Python CLI Version
- Menu-driven conversation flow
- NPC mood and trust tracking
- Character memory and quest support
- Inventory item trading
- Multiple NPCs with distinct personalities

## How to Play

### Browser Version
1. Open `index.html` in your browser.
2. Read the NPC dialogue and inspect the retro UI.
3. Use GitHub Pages to publish the root site.

### Python Version
1. Run `python-game/main.py`.
2. Choose a dialogue option from the menu.
3. Offer items, inspect memory, or switch NPCs.
4. Keep building trust through your choices.

## NPC Characters

- Aldric the Mage
- Elena the Ranger
- Marcus the Merchant
- Lyra the Bard

Each NPC has a different tone, trust response, and memory of your actions.

## Deployment

For GitHub Pages, keep these files in the repository root:
- `index.html`
- `style.css`

Then enable Pages in repository settings or use the included GitHub Actions workflow.

## Python CLI

The Python version lives in `python-game/` and includes:
- `main.py`
- `game.py`
- `npc.py`

Run it with:

```bash
python3 python-game/main.py
```

## Notes

- The browser version is now a static retro prototype.
- The JavaScript files were intentionally removed in this branch.
- Temporary Python cache files are ignored so the repo stays clean.

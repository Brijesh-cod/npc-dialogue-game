# GitHub Pages Deployment Guide

## Quick Start

### 1. Create a GitHub Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial NPC Dialogue Game"

# Create repository on GitHub (https://github.com/new)
# Then add remote and push:
git remote add origin https://github.com/YOUR_USERNAME/npc-dialogue-game.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment", select:
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `/(root)`
4. Click **Save**

### 3. Your Game is Live!

Your game will be available at: `https://YOUR_USERNAME.github.io/npc-dialogue-game/`

---

## Alternative: Using GitHub Actions (Auto-Deploy)

If you want automatic deployments on each push:

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

2. Push to main:
```bash
git add .github/
git commit -m "Add GitHub Pages workflow"
git push
```

3. GitHub Actions will automatically deploy your site!

---

## Troubleshooting

### 404 Error?
- Make sure GitHub Pages is enabled in Settings
- Wait 1-2 minutes for the deployment to complete
- Clear your browser cache

### Links Not Working?
- If you're using a custom domain, update the `CNAME` file
- If using a project repository, add `/npc-dialogue-game` to all paths in `index.html`

### Game Not Loading?
- Check browser console (F12) for errors
- Verify all `.js` files are in the same directory
- Ensure file names match exactly (case-sensitive)

---

## Local Testing Before Deploying

To test locally before pushing to GitHub:

```bash
# Simple HTTP server (Python 3)
python -m http.server 8000

# Or Node.js (http-server package)
npx http-server

# Then visit: http://localhost:8000
```

---

## Updating Your Game

1. Make changes locally
2. Test at `http://localhost:8000`
3. Commit and push:
```bash
git add .
git commit -m "Your changes"
git push
```

4. GitHub Pages will auto-deploy within 1-2 minutes!

---

## File Structure for GitHub Pages

```
npc-dialogue-game/
├── index.html          ← Entry point
├── style.css
├── npc.js
├── game.js
├── README.md
├── .gitignore
└── .github/
    ├── workflows/
    │   └── deploy.yml (optional)
    └── copilot-instructions.md
```

All files should be in the root directory for GitHub Pages to serve them correctly.

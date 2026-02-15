# Ammar Fitri Artwork - Static Landing Page

A lightweight, production-ready static landing page for **Ammar Fitri Artwork** built with pure HTML, CSS, and vanilla JavaScript.

## Files
- `index.html` - Semantic structure, SEO metadata, sections, and Instagram embed markup
- `styles.css` - Dark cinematic theme, responsive layout, accessibility states, and micro-interactions
- `script.js` - Mobile menu, section reveal animation, Instagram fallback, and back-to-top behavior

## Deploy to Cloudflare Pages
1. Push this project to a Git repository (GitHub/GitLab).
2. In Cloudflare Dashboard, go to **Pages** -> **Create a project** -> connect your repository.
3. Use these build settings:
   - **Framework preset:** `None`
   - **Build command:** `none`
   - **Build output directory:** `/`
4. Deploy.

This project has no backend and no build step; Cloudflare serves it as a static site directly.

## Local Preview
- Quick preview: open `index.html` in your browser.
- Optional local server:
  - `python3 -m http.server 8080`
  - Visit `http://localhost:8080`

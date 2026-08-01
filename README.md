# shashankmadala.com

Personal site for Shashank Madala. Static HTML/CSS/JS, no build step, no dependencies.

Design notes:
- Dark blue-black canvas with grain, cream serif display type (Instrument Serif), IBM Plex Mono labels
- Typewriter hero with cycling roles and a live auto-typing terminal card
- Scroll-scrubbed statement (words light up as you scroll)
- Sticky stacked work cards that scale and dim as the next card covers them
- Honors rendered as a printing receipt ledger
- Press cards with hover pull-quote sneak peeks
- Custom cursor, magnetic buttons, parallax orbs, marquee, scroll progress bar
- Full prefers-reduced-motion support

## Run locally

```
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deploy

Hosted on Vercel from the `personal-website` GitHub repo. Push to `main` to redeploy.

To point a custom domain (e.g. shashankmadala.com): Vercel → Project → Settings → Domains, then update the canonical URL in `index.html`, `sitemap.xml`, and `robots.txt` if the domain changes.

# Teacher Traveling — Next.js + TinaCloud

Rebuilt from **soloist.ai** (Mozilla Solo export) by Solo Lifeline.
1 page · 9 content blocks · 19 media references.

## The situation
Solo's *Download Website Data* is a static HTML snapshot plus a CSV of image **links**.
No CSS files, no fonts, no working form — and every byte of it is deleted on **30 Nov 2026**.
This repo is the replacement: content as text files in a git repo you own, an in-browser
editor for non-technical changes, hosting you choose.

## First five minutes
```bash
npm run media      # pull every image while Solo's CDN still answers
npm install
npm run dev
```
Then open **http://localhost:3000/admin** (Tina's editor). Edit a headline, save, watch the file change in git.

## Publish
1. `git init && git add -A && git commit -m "rescued from Solo" && git push` to GitHub.
2. Import the repo into Vercel or Netlify. Build command: `tinacms build && next build`.
3. Point the domain at the new host. If the domain came from Solo, transfer it out **weeks before 30 Nov 2026**.
4. Add the variables from `.env.example` (`TINA_CLIENT_ID`, `TINA_TOKEN` from app.tinabuilder.com).

## Look and feel
Solo's stylesheet is unreachable (it lived at `soloist.ai/_next/...`), so `src/app/globals.css` was written from what your export actually used: `#ffffff` paper, `#101010` ink, `#5b5b66` accent, Gloock over Libre Franklin. Five variables restyle the whole site.

## Checklist
- [ ] `npm run media` and no "missing" lines in its output
- [ ] Block types reviewed (see the converter's content map)
- [ ] Form test-submitted end to end
- [ ] Domain DNS moved, HTTPS issued
- [ ] `_private/` still gitignored, CSVs out of the repo
- [ ] Editor access limited to the people who should have it

# Deployment Guide

This site is a Next.js app with Tina CMS. Content lives in Git under `content/`. Tina Cloud provides the editing API. Vercel builds and serves the public site and the `/admin` editor.

Use this guide to run the site locally, deploy it, connect the domain, and hand the editor to a non-technical maintainer.

## 1. Architecture

| Piece | Role |
| --- | --- |
| GitHub | Source of truth for code, content, and media |
| Tina Cloud | Authentication, content API, and visual editing |
| Vercel | Builds and hosts the Next.js site |
| `content/pages/index.md` | Homepage sections |
| `content/global/settings.json` | Logo, navigation, footer, SEO, theme |
| `content/posts/` | Talk and writing posts |
| `public/uploads/` | Images used by the site |
| `tina/config.ts` | Tina schema, field labels, editor helpers |
| `public/admin/index.html` | Generated Tina admin app |
| `next.config.mjs` | Rewrites `/admin` to the generated admin app |

The public site and the editor use the same repository and branch. Saving in Tina creates a Git commit. Vercel then builds a new deployment.

## 2. Prerequisites

Install these first:

1. Node.js 22 or newer.
2. npm.
3. Git.
4. Access to the GitHub repository:
   `https://github.com/artemisoftnian/teachertraveling.git`
5. A Tina Cloud account connected to that repository.
6. A Vercel account with access to the repository.
7. Optional: a form inbox service if `mailto:` forms must be replaced.

## 3. Local setup

Clone the repository:

```bash
git clone https://github.com/artemisoftnian/teachertraveling.git
cd teachertraveling
npm install
```

Create a local `.env` file in the project root:

```env
NEXT_PUBLIC_TINA_CLIENT_ID=your-tina-cloud-client-id
TINA_TOKEN=your-tina-cloud-token
TINA_BRANCH=main
```

Optional, only when a real form endpoint exists:

```env
NEXT_PUBLIC_FORM_ENDPOINT=https://your-form-service.example/submit
```

Notes:

- `.env` is gitignored. Do not commit it.
- `TINA_TOKEN` is a secret. Do not share it in chat, screenshots, issues, or docs.
- `NEXT_PUBLIC_TINA_CLIENT_ID` is public by design.
- If no form endpoint is set, Contact and Newsletter forms open the visitor's email app with a prepared message. No submissions are stored by this site.

Start the local site:

```bash
npm run dev
```

Open:

- Public site: `http://localhost:3000/`
- Tina editor: `http://localhost:3000/admin`

The `dev` script runs `tinacms dev -c "next dev"`. It keeps the generated Tina client in sync with `tina/config.ts`.

## 4. Tina Cloud setup

1. Sign in to Tina Cloud.
2. Connect this GitHub repository.
3. Select branch `main`.
4. Set the media folder to `public/uploads`.
5. Copy the Client ID into `NEXT_PUBLIC_TINA_CLIENT_ID`.
6. Create or copy a read/write token into `TINA_TOKEN`.
7. Confirm the schema collection names are:
   - `page` at `content/pages`
   - `settings` at `content/global`
   - `post` at `content/posts`

### Schema sync

Tina Cloud reads the schema from Git. A config-only change may not update the Cloud schema. When changing `tina/config.ts`, include a small content change in the same commit. The HTML comment at the bottom of `content/pages/index.md` is used for this purpose.

After pushing a schema change:

1. Wait for Tina Cloud to reindex.
2. Hard-refresh `/admin`.
3. Run `npx tinacms audit --verbose --noTelemetry` locally.

Expected audit result:

```text
Checking page collection. 1 Documents
Checking settings collection. 1 Documents
Checking post collection. 1 Documents
✅ Audit passed
```

## 5. Vercel deployment

1. In Vercel, choose **Add New → Project**.
2. Import `artemisoftnian/teachertraveling`.
3. Keep the default framework detection: **Next.js**.
4. Keep the root directory as the repository root.
5. Set Node.js version to **22.x** under Project Settings → General.
6. Add the environment variables from `.env`:
   - `NEXT_PUBLIC_TINA_CLIENT_ID`
   - `TINA_TOKEN`
   - `TINA_BRANCH=main`
   - `NEXT_PUBLIC_FORM_ENDPOINT` only if a form service is configured
7. Deploy.

Build command:

```bash
npm run build
```

Output directory:

```text
.next
```

`npm run build` first runs `tinacms build`, then `next build`. The Tina build needs the Tina Cloud variables. If those variables are missing, the build can fail with `ERR_CLOUD_CHECK_FAILED`.

After the first deploy:

1. Open `https://<vercel-project>.vercel.app/`.
2. Confirm the homepage loads.
3. Open `https://<vercel-project>.vercel.app/admin`.
4. Sign in with Tina Cloud.
5. Confirm the homepage opens in visual editing with the live page beside the sidebar.

## 6. Custom domain

The current `teachertraveling.com` domain still points to the original Solo site. Switch DNS only after the new Vercel deployment has passed testing.

1. In Vercel, open the project → **Settings → Domains**.
2. Add `teachertraveling.com` and `www.teachertraveling.com`.
3. Copy the DNS records Vercel shows.
4. In the domain registrar, replace the old records with the Vercel records.
5. Wait for DNS propagation. This can take minutes or hours.
6. Confirm Vercel shows **Valid Configuration**.
7. Confirm SSL is active.
8. Test both `https://teachertraveling.com/` and `https://www.teachertraveling.com/`.

If email uses the same domain, keep the existing MX records unless a separate mail migration is planned.

## 7. Editing workflow for the maintainer

1. Open `/admin` and sign in.
2. Open **Homepage** from the left menu.
3. Use the **Start here** checklist.
4. Click text, photos, or buttons on the live page. Blue **Edit** labels show clickable areas.
5. Edit the matching field in the sidebar.
6. Use **Section color**, **Card color**, **Button color**, **Headline size**, and **Text size** for safe visual changes.
7. Use **Page sections** to reorder, add, or remove sections.
8. Press **Save**.

Visual editor extras:

- Edit-only jump bar at the top of the preview.
- Edit-only badges on heads, text, photos, buttons, captions, reviews, and FAQ items.
- Safe color presets: White, Light grey, Yellow, Blue, Dark.
- Safe text sizes: Small, Normal, Large, Extra large.
- Live Google title preview under Site settings → Search results.

Do not change **Colors and fonts** in Site settings unless a brand change is requested. It controls the global palette and typefaces.

Available Solo section templates:

- Article
- Contact
- Customer Reviews (`reviews`)
- FAQ
- Gallery
- Image Banner
- Introduction (`intro`)
- Logo Grid
- Newsletter
- Scheduling
- Services
- Team
- Text Banner
- Video
- Code Embed

New templates are available in the **Add section** menu. They are not inserted into the homepage by default.

Security notes for advanced sections:

- Video accepts YouTube and Vimeo page links only.
- Code Embed accepts an HTTPS iframe URL from an approved provider only. Raw HTML and scripts are rejected.
- Newsletter opens an email to the configured address. It does not store subscribers.

## 8. Manual deploy and verification

From a clean checkout:

```bash
npm install
npx tinacms build --skip-cloud-checks
node node_modules/next/dist/bin/next build
npx tinacms audit --verbose --noTelemetry
```

For the normal build, use:

```bash
npm run build
```

Verification checklist:

- `GET /` returns 200.
- `GET /admin` returns 200.
- `GET /blog/announce-a-talk` returns 200.
- Homepage shows all 11 original Solo sections.
- Homepage has no `object Object`, `undefined`, or duplicated copy.
- `/admin` opens visual editing, not the full-page form only.
- Clicking a headline opens the matching sidebar field.
- Typing in the sidebar updates the preview.
- Save creates a Git commit.
- Vercel starts a new deployment after the commit.
- Public site updates after the deployment finishes.

## 9. Rollback

For a bad content edit:

1. Open the file in GitHub.
2. Use **History** to find the previous version.
3. Revert or copy back the previous content.
4. Wait for Tina Cloud and Vercel to rebuild.

For a bad deployment:

1. Open Vercel → **Deployments**.
2. Find the last good deployment.
3. Choose **… → Promote to Production**.
4. Fix the main branch before the next deploy.

For a local change that should not be pushed:

```bash
git restore <file>
```

For all uncommitted local changes:

```bash
git restore .
```

Use this only when the changes are known to be disposable.

## 10. Common problems

### Homepage returns 404

Check `tina/config.ts`. The page collection must use:

```ts
match: { include: "**/*" }
```

and content must live at `content/pages/index.md`.

### `/admin` returns 404

Check `next.config.mjs`. It must rewrite `/admin` to `/admin/index.html`. Also confirm `public/admin/index.html` exists after `tinacms build`.

### Build fails with `ERR_CLOUD_CHECK_FAILED`

The Tina Cloud token or client ID is missing or Cloud has not reindexed after a schema change. Add the environment variables, push a config-plus-content commit, wait for reindex, then deploy again.

### Editor opens the full-page form

Confirm the `page` collection has `ui.router` in `tina/config.ts`. The homepage document `index` must route to `/`.

### Blue edit labels do not appear

They only appear inside Tina's visual editor. Open the homepage from the collection list, not the generic full-page form. Hard-refresh `/admin` after a new deployment.

### Images are missing

Images must be in `public/uploads/` and committed to Git. In Tina, use the **Media** tab to pick existing uploads.

### Contact form does not deliver email

Without `NEXT_PUBLIC_FORM_ENDPOINT`, the site uses `mailto:`. That depends on the visitor's email app. Configure a form service if submissions must be collected on the server.

### New section does not appear after adding it

Hard-refresh `/admin`. If the section is still missing, Tina Cloud has not reindexed the new schema. Push a config-plus-content commit and wait.

## 11. Important files

```text
tina/config.ts                       Tina schema, labels, editor tools
tina/tina-lock.json                  Generated schema lock
src/components/Blocks.tsx            Section renderers and editor visual tools
src/components/TinaLive.tsx          useTina bridge
src/lib/tina/queries.ts              Shared page/settings query
src/lib/tina/client.ts               Tina client and slug handling
src/app/[[...slug]]/page.tsx         Public page route
src/app/blog/[slug]/page.tsx         Blog post route
src/app/globals.css                  Site and editor-only styles
next.config.mjs                      /admin rewrite
content/pages/index.md               Homepage content
content/global/settings.json         Site settings
content/posts/                       Blog content
public/uploads/                      Local media
public/admin/                        Generated Tina admin app
.env                                 Local secrets, gitignored
DEPLOYMENT.md                        This guide
```

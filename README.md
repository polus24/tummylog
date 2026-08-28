# TummyLog

A small installable web app (PWA) for looking up whether a food or drink is
generally safe for IBS. The food list is **shared and open** — anyone who
uses the app can add or edit an entry, and everyone sees the same list.

- Search or browse ~100 common foods and drinks, pre-tagged as **Fine**,
  **Moderation**, or **Avoid** using a low-FODMAP framework.
- Add a food that isn't listed yet, or edit any existing entry's status
  and notes — changes are visible to everyone, immediately, no login
  required.
- Installs to your home screen like a native app (Add to Home Screen /
  Install app), and shows a cached copy with a clear banner if you're
  offline (editing is paused until you're back online, since there's
  nowhere local to save a change).

## Architecture

Two pieces:

1. **The app** (this folder, minus `worker/`) — plain HTML/CSS/JS, no
   build step. Hosted for free on GitHub Pages.
2. **The shared API** (`worker/`) — a small Cloudflare Worker backed by
   Workers KV, holding the one shared list everyone reads and writes to.
   See `worker/README.md` for how to deploy it (dashboard only, no CLI).

The app is only as "live" as its connection to the Worker — `config.js`
holds the one line that points the app at your deployed Worker's URL.
Until that's set, the app falls back to a bundled read-only copy of the
default list.

## Project structure

```
index.html              app shell
styles.css               all styling
app.js                    app logic (search, filters, modal, API calls)
config.js                 the one line you edit: your Worker's URL
data/foods.js              bundled fallback/offline copy of the default list
manifest.webmanifest      PWA manifest
sw.js                     service worker (offline shell caching)
icons/                    app icons (various sizes) + source SVGs
worker/
  worker.js                the Cloudflare Worker source
  README.md                 how to deploy it, dashboard-only
```

## Running locally

No build tools needed. From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`. Without a deployed Worker (see below),
you'll see the "showing a saved copy" banner and can browse the default
list, but can't add or edit.

## Setup order

1. **Deploy the Worker first** — follow `worker/README.md`. You'll end up
   with a URL like `https://tummylog-api.your-subdomain.workers.dev`.
2. **Point the app at it** — edit `config.js`, replacing the placeholder
   URL with your Worker's URL plus `/api/foods`.
3. **Deploy the app** — push it to GitHub Pages (steps below).

## Deploying the app to GitHub Pages

1. Create a new GitHub repo and add this folder's contents to it (via
   `git push` or by dragging files into GitHub's web upload — either
   works, since there's no build step).
2. In the repo: **Settings → Pages → Build and deployment**, set
   **Source** to "Deploy from a branch", branch `main`, folder `/root`.
   Save.
3. GitHub publishes it at `https://<your-username>.github.io/tummylog/`
   within a minute or two.

## Fronting it with Cloudflare (optional)

This is separate from the Worker above — it's only for putting a custom
domain in front of the already-live GitHub Pages site:

1. Add your domain to Cloudflare and point its nameservers at Cloudflare.
2. In Cloudflare DNS, add a `CNAME` record for the subdomain you want
   (e.g. `tummylog.yourdomain.com`) pointing to
   `<your-username>.github.io`, proxy (orange cloud) on.
3. In your GitHub repo, add a `CNAME` file at the project root containing
   just your custom domain (Settings → Pages → Custom domain does this
   for you).
4. In Cloudflare, under **SSL/TLS**, set encryption mode to **Full**.

## Updating the default/fallback list

`data/foods.js` is only the offline/first-load fallback now — the live
source of truth is the Worker's KV store. To change what a fresh
deployment seeds into KV, edit the `SEED_FOODS` array embedded in
`worker/worker.js` before first deploying it (it only seeds once, the
first time `/api/foods` is called with an empty store).

## A note on the open-editing model

Since there's no login, anyone who can reach the app can add, edit, or
delete any food entry. That's a deliberate trade-off for zero friction —
see the bottom of `worker/README.md` for options if it ever becomes a
problem (a shared passphrase, rate limiting, or real accounts).

Statuses follow a general low-FODMAP elimination framework as a starting
point — not medical advice, and individual triggers vary.

# TummyLog

A small installable web app (PWA) for looking up whether a food or drink is
generally safe for IBS, and keeping your own notes on how specific foods
affect you.

- Search or browse ~100 common foods and drinks, pre-tagged as **Fine**,
  **Moderation**, or **Avoid** using a low-FODMAP framework.
- Add your own notes to any food — safe portion sizes, timing, personal
  triggers.
- Add foods that aren't in the default list.
- Works offline once installed, and installs to your home screen like a
  native app (Add to Home Screen / Install app).
- All your notes and custom foods are stored locally in your browser
  (`localStorage`) — nothing is sent to a server.

This is a static site: plain HTML/CSS/JS, no build step, no backend.

## Project structure

```
index.html              app shell
styles.css               all styling
app.js                    app logic (search, filters, modal, storage)
data/foods.js             default food database
manifest.webmanifest      PWA manifest
sw.js                     service worker (offline caching)
icons/                    app icons (various sizes) + source SVGs
```

## Running locally

No build tools needed. From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`. (Opening `index.html` directly as a
`file://` URL also works for basic testing, but the service worker only
registers over `http://`/`https://`.)

## Deploying to GitHub Pages

1. Create a new GitHub repo and push this folder as its contents (this
   README included):

   ```bash
   cd tummylog
   git init
   git add .
   git commit -m "Initial TummyLog PWA"
   git branch -M main
   git remote add origin https://github.com/<your-username>/tummylog.git
   git push -u origin main
   ```

2. In the repo on GitHub: **Settings → Pages → Build and deployment**,
   set **Source** to "Deploy from a branch", branch `main`, folder `/root`.
   Save.

3. GitHub will publish it at `https://<your-username>.github.io/tummylog/`
   within a minute or two.

## Fronting it with Cloudflare (optional)

If you want a custom domain, caching, and analytics in front of GitHub
Pages:

1. Add your domain to Cloudflare and point its nameservers at Cloudflare
   (via your domain registrar).
2. In Cloudflare DNS, add a `CNAME` record for the subdomain you want
   (e.g. `tummylog.yourdomain.com`) pointing to
   `<your-username>.github.io`, with the proxy (orange cloud) turned on.
3. In your GitHub repo, add a `CNAME` file at the project root containing
   just your custom domain, e.g.:

   ```
   tummylog.yourdomain.com
   ```

   (Settings → Pages also has a "Custom domain" field that creates this
   file for you.)
4. In Cloudflare, under **SSL/TLS**, set encryption mode to **Full** (not
   Flexible) so HTTPS works correctly end-to-end.

Once DNS propagates, the app is live at your custom domain, served through
Cloudflare's edge with GitHub Pages as the origin.

## Updating the food database

Edit `data/foods.js`. Each entry looks like:

```js
{ id: "onion", name: "Onion", category: "Vegetables", status: "avoid", tip: "All forms, including powder." }
```

`status` is one of `"ok"`, `"moderate"`, or `"avoid"`. `id` must be unique
and stable — it's used as the storage key for any personal note or status
override a user attaches to that food, so changing an existing `id` will
orphan notes users have already saved against it.

## Notes on the data

Statuses follow a general low-FODMAP elimination framework as a starting
point — they are not medical advice, and individual triggers vary. The app
is built around letting people record their own experience per food via
the notes field, rather than treating the default list as gospel.

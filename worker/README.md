# TummyLog shared API — Cloudflare Worker

This is the backend for TummyLog's shared, open food list: a small
Cloudflare Worker backed by a Workers KV namespace. Anyone who visits the
app reads and writes through this Worker, so everyone sees the same list.

No terminal or CLI tools are required — everything below is done in the
Cloudflare dashboard in your browser.

## 1. Create a KV namespace

1. In the Cloudflare dashboard, go to **Storage & Databases → KV**.
2. Click **Create a namespace**.
3. Name it something like `tummylog-foods`. Click **Add**.

## 2. Create the Worker

1. Go to **Workers & Pages → Create → Create Worker**.
2. Give it a name, e.g. `tummylog-api` (this becomes part of its URL:
   `tummylog-api.<your-subdomain>.workers.dev`).
3. Click **Deploy** to create it with the default "Hello World" code — you'll
   replace that next.
4. Click **Edit code** (this opens the online code editor — no local setup
   needed).
5. Select all the existing sample code and delete it.
6. Open `worker.js` from this folder, copy its entire contents, and paste it
   into the editor.
7. Click **Deploy** (or **Save and deploy**) in the editor.

## 3. Bind the KV namespace to the Worker

The Worker's code expects a KV binding called `FOODS_KV` — without this
step it will error on every request.

1. Go to your Worker's page → **Settings → Variables and Secrets** (or
   **Bindings**, depending on the current dashboard layout).
2. Under **KV Namespace Bindings**, click **Add binding**.
3. Set **Variable name** to exactly `FOODS_KV`.
4. Set **KV namespace** to the `tummylog-foods` namespace you created in
   step 1.
5. Save. Redeploy the Worker if prompted.

## 4. Get your Worker's URL

On the Worker's page, you'll see its URL, something like:

```
https://tummylog-api.your-subdomain.workers.dev
```

Your API endpoint is that URL plus `/api/foods`, e.g.:

```
https://tummylog-api.your-subdomain.workers.dev/api/foods
```

## 5. Point the app at it

Back in your TummyLog repo (on GitHub, or locally), open `config.js` and
replace the placeholder URL with your real one, keeping `/api/foods` at
the end:

```js
const TUMMYLOG_API_URL = "https://tummylog-api.your-subdomain.workers.dev/api/foods";
```

Save/commit that change. Once GitHub Pages redeploys (usually under a
minute), the app will start reading and writing through your Worker, and
the "Showing a saved copy" banner should disappear.

## 6. Test it

Visit your Worker URL directly in the browser at `/api/foods` — you should
see a big JSON array of the ~100 seeded foods. If you see an error instead,
double-check the KV binding name is exactly `FOODS_KV` (step 3) and that
the Worker deployed without errors.

## How the data is stored

The whole food list lives as one JSON blob under the KV key `"foods"`. The
Worker seeds it automatically from a bundled default list the first time
`/api/foods` is called and the key doesn't exist yet.

- `GET /api/foods` — returns the full list
- `POST /api/foods` — creates or updates one entry (send `{ id?, name, category, status, notes }`; omit `id` to create a new one)
- `DELETE /api/foods/:id` — removes one entry

## About the "open, no login" model

Anyone who can reach your Worker's URL can add, edit, or delete any entry —
there's no authentication. That's the trade-off for zero login friction.
If this ever becomes a problem (spam, vandalism), reasonable next steps
include:

- Adding a shared "edit passphrase" the Worker checks on write requests
- Rate-limiting by IP using Cloudflare's built-in rate limiting rules
- Adding real accounts (a bigger change — Cloudflare Access or a proper
  auth provider would be the way to go)

None of that is set up here — just flagging it so it's a deliberate choice
rather than a surprise.

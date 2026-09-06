# Pan Worker

The Hugo site is deployed as static GitHub Pages, so the Vyuyun credentials must stay in a server-side Worker. This Worker handles the `/pan/api/*` requests used by the Pan page, refreshes the seven-day Vyuyun token automatically, and protects the page with an HttpOnly 90-day session cookie.

## Deploy

From this directory:

```sh
npx wrangler login
npx wrangler deploy
npx wrangler secret put PAN_PASSWORD
npx wrangler secret put SESSION_SECRET
npx wrangler secret put VYUYUN_APPID
npx wrangler secret put VYUYUN_APPSECRET
```

Use a long random value for `SESSION_SECRET`; `PAN_PASSWORD` can be `0428` as requested. The appid/appsecret are created in Vyuyun under personal settings, security and API.

In Cloudflare, add a route for `your-domain.example/pan/api/*` to this Worker. The domain must be proxied through Cloudflare. GitHub Pages continues to serve `/pan/` and the Worker only handles the API path. The API path must be reachable under the same origin as the Hugo page so the session cookie is sent.

The upload API gives the browser a temporary upload token and signed chunk URLs, which is required by Vyuyun. The long-lived appsecret and the seven-day account token remain in the Worker.

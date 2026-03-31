# Vite DevTools + basicSsl Bug Reproduction

This repository demonstrates a bug where `@vitejs/devtools` fails to connect when the user's Vite config includes `server.https` (e.g., via `@vitejs/plugin-basic-ssl`).

## Bug Description

When running the standalone devtools server, the client gets stuck on the "Vite DevTools needs Authorization" screen because the WebSocket connection fails.

**Root Cause:** The devtools WebSocket server inherits `server.https` from the user's Vite config and creates a WSS (secure WebSocket) server, but the HTTP page is served over plain HTTP. This causes a protocol mismatch where the client tries `ws://` but the server expects `wss://`.

## Steps to Reproduce

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the analyze command:

   ```bash
   npm run analyze
   ```

3. Open browser to `http://localhost:9999/devtools/`

4. Observe:
   - Browser console shows: `WebSocket connection to 'ws://localhost:7812' failed`
   - Page is stuck on "Vite DevTools needs Authorization" screen
   - Terminal shows: `[Vite DevTools] Client authentication is disabled` (misleading - auth is disabled on server, but client can't connect)

## Expected Behavior

The devtools should load without the authorization prompt since the server has auth disabled in build mode.

## Actual Behavior

The WebSocket connection fails and the client remains stuck on the auth prompt.

## Workaround

The workaround is already documented in `vite.config.js`. To fix the issue:

1. Comment out the `basicSsl()` line
2. Uncomment the conditional version:

```js
const useDevTools = process.env.ANALYZE === "1";

export default defineConfig({
  plugins: [
    // basicSsl(),  // Comment this out
    !useDevTools && basicSsl(), // Uncomment this - skips SSL when running devtools
  ],
  devtools: {
    enabled: useDevTools,
  },
});
```

This conditionally disables the SSL plugin when `ANALYZE=1`, avoiding the WSS/WS protocol mismatch.

## Environment

- `@vitejs/devtools`: ^0.1.11
- `@vitejs/plugin-basic-ssl`: ^2.3.0
- `vite`: ^8.0.1
- Node.js: v20+

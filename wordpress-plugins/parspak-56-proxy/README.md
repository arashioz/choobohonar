# ParsPek Path Proxy

1. Upload this directory to `wp-content/plugins/`.
2. Activate **ParsPek Path Proxy**.
3. In **Settings → ParsPek Path Proxy**, confirm the target and enable it.

The plugin proxies only the configured prefix; visitors cannot supply a target URL.

For a Next.js application, configure the upstream application with `basePath: "/56"` before deployment. Without a Next.js base path, its root-relative `/_next`, API, and navigation URLs cannot be made reliable by an HTML proxy alone. This plugin forwards all requests below the prefix, including `/56/_next/*` and `/56/api/*`, preserves methods/query strings, rewrites upstream redirect locations and cookie paths, and streams response bodies through PHP cURL.

PHP remains in the data path, so a web-server reverse proxy is faster for large static assets and long-lived streaming responses. Do not enable a page-cache plugin for the proxied prefix.

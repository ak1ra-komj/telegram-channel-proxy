
# telegram-channel-proxy

Yet another Telegram Channel Proxy running on Cloudflare Workers.

## Quick start

* Clone this repo, `cd telegram-channel-proxy/`.
* Install `npm` dependencies, `npm install`
* If you don't have `wrangler` installed, [install it](https://developers.cloudflare.com/workers/#installing-the-workers-cli).
* `cp wrangler.toml.example wrangler.toml`, edit routes in this file.
* edit `config.domain` and `config.channel` in [src/config.ts](src/config.ts),
    or config it via `env.DOMAIN`, `env.CHANNEL` environment variables.
* Run `wrangler dev` in your terminal to start a development server, or
    run `wrangler publish` to publish your worker
* Add the DNS records in [Cloudflare Dashboard](https://dash.cloudflare.com/)
    [Workers/Triggers/Custom Domains](https://developers.cloudflare.com/workers/platform/routing/custom-domains) for your worker.

## Environment variables

* `env.DOMAIN` (default: `undefined`), your proxy domain, same domain as in routes from `wrangler.toml`.
* `env.CHANNEL` (default: `undefined`), the Telegram Channel username you want to proxy.

## License

MIT

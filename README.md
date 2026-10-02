# threedotsadvisory.com

Public website for **Three Dots Advisory LLC**: four pages (Home, Approach, About, Contact), plus a 404 page and a placeholder privacy page. The site is plain static HTML/CSS with no framework, no tracking and no forms. The only contact path is a `mailto:` link.

## Editing the site

| What to change | File |
|---|---|
| Page copy | `src/pages/index.html`, `approach.html`, `about.html`, `contact.html` |
| Header, footer and the footer disclosure (shared by every page) | `src/layout.html` |
| Page `<title>` / meta description | The comment block at the top of each page file |
| Colors, type, spacing | `public/assets/css/site.css` (design tokens are in `:root` at the top) |
| Privacy policy | `src/pages/privacy.html` (**placeholder: replace it with the client-supplied text**) |
| Images, fonts, favicons, `robots.txt`, `_headers` | `public/` (copied to the site unchanged) |

Commit and push to the production branch, and Cloudflare Pages rebuilds and deploys automatically in about a minute. Every other branch or pull request gets its own preview URL.

> Copy is compliance-reviewed. Change wording only with the client's approval, and don't add performance figures.

## Build and local preview

The build needs no dependencies, only Node 18+.

```sh
node build.mjs          # writes the site to dist/
npx serve dist          # preview at http://localhost:3000
```

`build.mjs` wraps each page in `src/layout.html`, marks the current page in the nav, copies `public/` and writes `sitemap.xml`. Pages marked `robots: noindex` (404, privacy) are left out of the sitemap.

## Cloudflare settings (Workers & Pages → Create → Import a repository)

| Setting | Value |
|---|---|
| Project name | `threedotsadvisory` (must match `name` in `wrangler.jsonc`) |
| Build command | `node build.mjs` |
| Deploy command | `npx wrangler deploy` |
| Path | `/` |

`wrangler.jsonc` tells Cloudflare to serve `dist/` as static assets, with `404.html` for missing pages. `public/_headers` sets security headers (a strict CSP, HSTS, no framing) and long-term caching for fonts.

## Domain (GoDaddy registrar, Cloudflare DNS)

1. In Cloudflare, add the site `threedotsadvisory.com` on the Free plan. **Check that the imported DNS records include every MX, SPF (TXT), DKIM and DMARC record**, because they carry alan@threedotsadvisory.com. Compare them against GoDaddy's DNS page before switching.
2. In GoDaddy, go to **Domain → DNS → Nameservers → Change → "I'll use my own nameservers"** and enter the two Cloudflare nameservers. Turn off DNSSEC at GoDaddy first if it's on.
3. Once Cloudflare shows the domain as **Active**, delete the old Website Builder A records and the `www` CNAME. Then open **Workers & Pages → threedotsadvisory → Settings → Domains & Routes → Add → Custom domain** and add `threedotsadvisory.com`, then `www.threedotsadvisory.com`.
4. To redirect `www` to the apex, go to **Rules → Redirect Rules** and create a rule for hostname `www.threedotsadvisory.com` that does a dynamic 301 to `concat("https://threedotsadvisory.com", http.request.uri.path)`, preserving the query string.
5. Turn on **SSL/TLS → Edge Certificates → Always Use HTTPS**.

## Recordkeeping

The git history is a dated archive of every published version. Tag each release, for example:

```sh
git tag v2026.10.01 && git push origin v2026.10.01
```

## Open items before launch

- [ ] Privacy policy text for `/privacy/` (currently a placeholder with `noindex`).
- [ ] Decide whether the "Form ADV Part 2A & 2B" footer link should point to the firm's own ADV PDFs instead of IAPD.
- [ ] Confirm the statement that IRAs use "a related model".
- [ ] Confirm the account types (individual, joint, IRA, trust) and the "Murray Hill, Manhattan" location.
- [ ] Confirm the Core & Overlay description matches the strategy disclosure in Form ADV.

## Implementation notes

- Fonts (Source Serif 4 and Hanken Grotesk, Latin subsets, variable weight) are self-hosted from `public/assets/fonts/`, with no Google requests.
- Small brass text (eyebrows and numerals) uses `#80642E`, a slightly darker brass than the design's `#9C7A38`, so it meets WCAG AA contrast. Rules, underlines and accents use the original `#9C7A38`.
- The design's mobile mock shortens some paragraphs. The site uses the full desktop wording at every screen size, so there is one version of the reviewed copy.
- The portrait is served as WebP at 600, 800 and 1000 px wide, with the original JPEG as fallback. The 1000 × 1500 source is too small for a true 1200 px version.
- The original design handoff (spec and standalone reference mock) is archived in `design/`. It isn't deployed.

# Handoff: Three Dots Advisory — public website

## Overview
Marketing website for **Three Dots Advisory LLC**, a solo, New York State–registered investment adviser (CRD #342640) run by Yuheng (Alan) Fu, CFA. Four pages: **Home, Approach, About, Contact**. The only conversion action is emailing alan@threedotsadvisory.com (mailto link). No forms, no logins, no backend.

Goal for Claude Code: build a production static site from the design, put it in a GitHub repo, and deploy it on Cloudflare Pages (or Netlify) under the GoDaddy-registered domain `threedotsadvisory.com`, so future edits are "change file → commit → auto-deploy".

## About the design files
`reference/three-dots-site-v2.dc.html` is a **design reference built in HTML**, not production code. It's a design canvas that shows a desktop mock (1180px, inside fake browser chrome) and a mobile mock (402px, inside a fake phone frame) side by side, with page switching done in JS state. **Don't ship it.** Recreate it as a real responsive site:

- Plain semantic HTML + one CSS file is enough (no framework required). Astro or Eleventy is fine if you want shared header/footer partials — pick one and keep the build trivial.
- Real URLs: `/`, `/approach/`, `/about/`, `/contact/`.
- Drop the fake browser chrome, the phone bezel and the "Desktop · v2 / Mobile · v2" labels.
- Desktop and mobile mocks are two renderings of the **same** page. Implement one responsive layout: desktop styles ≥ 900px, mobile styles below (tablet can use desktop layout with reduced side padding).

To view the reference: open `reference/three-dots-site-v2.dc.html` in a browser (it needs `support.js` next to it and loads the photo from `../Photos/`). Use the nav to switch pages. `reference/brand-board.dc.html` (with `support-brand.js` renamed to `support.js` if you want to open it) documents the wider brand system.

## Fidelity
**High fidelity.** Colors, type, spacing and copy are final. Match them closely. **Copy text verbatim from the reference file**; it was written and compliance-reviewed deliberately (don't rewrite, add marketing copy, or add performance numbers).

## Global layout
- Page background `#F5F1E9` (Bone). Content column max-width **1180px**, centered, side padding **64px** desktop / **22px** mobile.
- Most content sections use a **left-rail grid**: `grid-template-columns: 220px minmax(0,1fr); gap: 64px; padding: 96px 64px`. Left cell = eyebrow label (padding-top 12px), right cell = H2 + content. On mobile, stack: eyebrow, then content; section padding `48–52px 22px`.
- Section backgrounds alternate for rhythm: Bone `#F5F1E9`, Sand `#EDE7DA`, Paper `#FCFAF4` (with 1px hairline top/bottom `rgba(26,23,18,.1)`), and one Ink `#1A1712` section on Home.
- Hairline rules everywhere: `1px solid rgba(26,23,18,.14)` (lists), `.16` (fact rows), `.18–.2` (panels). Card tops use `1px solid #1A1712`. No rounded corners, no shadows on content.

### Header (all pages)
Height 76px, padding 0 64px, bottom border `1px rgba(26,23,18,.12)`. Left: wordmark "Three Dots Advisory" (Source Serif 4, 600, 21px, letter-spacing -.005em) → links to `/`. Right (gap 36px, 14px): "Approach", "About" (color `#3A342A`, hover `#9C7A38`; current page gets `border-bottom:1px solid #9C7A38`, padding 6px 0), then a bordered button "Send an inquiry" (1px solid `#1A1712`, 600, padding 10px 20px; hover: fill `#1A1712`, text `#F5F1E9`) → `/contact/`.
Mobile: 56px tall bar, wordmark 17px, a two-line menu toggle (two 22×1.5px ink bars, 44×44 tap target). The open menu is an ink panel below the bar with links Home / Approach / About in Source Serif 22px (14px vertical padding, hairline `rgba(245,241,233,.14)` separators) and "Send an inquiry →" in `#C79A4A`. Use a `<button aria-expanded>` and keep it keyboard accessible.

### Footer (all pages)
Ink `#1A1712`, padding 72px 64px 40px. Three-column grid `2fr 1fr 1fr`, gap 40px, bottom border `1px rgba(245,241,233,.14)`, padding-bottom 44px:
1. "Three Dots Advisory" (serif 600 21px `#F5F1E9`) + "Registered Investment Adviser / Murray Hill, Manhattan" (13.5px `#B5AD9C`).
2. Column label "Pages" (10.5px caps, .18em, 600, `#C79A4A`), links Home / Approach / About / Contact (14px `#D9D2C3`, hover `#C79A4A`).
3. Label "Disclosures": "Form ADV Part 2A & 2B" and "Firm record on IAPD" → `https://adviserinfo.sec.gov/firm/summary/342640` (new tab), "Privacy policy" → `/privacy/` (**placeholder; page content to be supplied by the client**).
Below: the disclosure paragraph (12.5px, line-height 1.75, `#B5AD9C`, max-width 920px) and "© 2026 Three Dots Advisory LLC" (12px `#9A9384`). Copy the exact text from the reference. Mobile: stacked, same content (no email in the footer).

## Pages

### Home (`/`)
1. **Hero** (padding 104px 64px 0): eyebrow "Registered Investment Adviser · Murray Hill, Manhattan"; H1 66px; lead paragraph 18px `#4A4436` max-width 590px; CTA row (gap 30px): primary ink button "Send an inquiry →" (`#1A1712` bg, `#F5F1E9` text, 14.5px 500, padding 16px 30px, hover `#000`) → `/contact/`, and a text link "How I invest →" (600, 1px brass underline, padding-bottom 3px) → `/approach/`. Then, 100px below, a **5-column facts strip** with a top hairline and vertical dividers: Credential / CFA® charterholder · Background / Former Microsoft data scientist · Investing since / 2014 · Standard / Fee-only fiduciary · Languages / English · 中文. Label 10.5px caps graphite, value serif 600 17px. Mobile: full-width buttons, facts become label-left/value-right rows.
2. **Statement + bio** (Sand, padding 96px 64px, grid `5fr 7fr`, gap 80px, centered vertically): left, a serif 400 34px statement; right, a portrait (168×212, `object-fit:cover; object-position:50% 18%`) + name (serif 600 24px), title (11px caps graphite), a short bio (15px), and the link "Full background →" → `/about/`. Mobile: statement 23px, portrait 84×106 beside the name.
3. **How it works** (rail): H2; 3 cards (grid 3 cols, gap 36px, top rule ink, title serif 600 20px, text 14.5px `#4A4436`); then a 2×2 spec list (label 150px column, caps 11px graphite; value 14.5px): Custodian, Account types, Reviews, Rebalancing.
4. **Who I work with** (Paper): H2; 3 numbered rows (brass serif numerals "01–03", 48px column; bold lead + text 15.5px); a **fee panel**: 3 columns, border `rgba(26,23,18,.2)`, bg Bone: Minimum `$200,000` / Advisory fee `1% per year` / My compensation `Fee-only` (values serif 600 28px); a note below (13.5px `#3A342A`).
5. **Where I can help** (Ink): eyebrow `#C79A4A`; H2 `#F5F1E9`; 2×2 grid (gap 40px 48px), each with top rule `rgba(245,241,233,.2)`, brass numeral, serif title 20px, text 14.5px `#C9C2B2`; a footnote 13.5px `#B5AD9C`.
6. **How I invest (teaser)** (rail): H2 with the right-aligned link "The full approach →"; 3 cards; a "Building blocks" row (serif 19px, top and bottom hairlines); a risk sentence 13.5px.
7. **Common questions** (Sand, rail): 6 Q&A rows, grid `260px 1fr`, gap 40px, padding 24px 0, hairlines `.18`; question serif 600 19px, answer 15px line-height 1.7. Mobile: question above answer. (Static, all answers visible; no accordion.)
8. **Closing** (padding 104px 64px 112px): eyebrow "Contact", H2 "Let’s talk." (serif 600 48px), a paragraph, and the ink "Send an inquiry →" button.

### Approach (`/approach/`)
1. Hero: eyebrow, H1 "How I invest." (62px), intro 18px max-width 660px, bottom hairline.
2. **The core model** (Paper): H2, paragraph, then a **3-cell diagram panel** (border `.2`, bg Bone). Each cell has a 5px full-width top bar: Core = solid `#1A1712`; Reserve = solid `#C6A968`; Overlay = dashed brass (`repeating-linear-gradient(90deg,#9C7A38 0 14px,transparent 14px 20px)`). Cell: label caps, title serif 600 21px, text 14.5px. Note below 13.5px. Mobile: cells stack with a 4px left border in the same colors.
3. **Principles** (rail, Bone): 4 rows, grid `48px 270px 1fr`, gap 24px: brass numeral, serif 600 22px title, 15px text.
4. **Risks** (Sand): H2 "What can go wrong."; 3 cards.
5. **Getting started** (Bone): H2; 4 step cards (numeral, serif 18px title, 14px text).
6. **About performance numbers** (Paper): H2 32px, paragraph, link "Request the strategy one-pager →" → `/contact/`, and a disclosure line under a hairline.

### About (`/about/`)
Two-column hero `0.85fr 1.15fr`: left, full-bleed portrait (min-height 700px, `object-position:50% 18%`); right (padding 96px 64px 80px): eyebrow, H1 "Yuheng (Alan) Fu, CFA" (46px), title caps, a serif 21px intro sentence, then 4 bio paragraphs (15.5px, line-height 1.75). Then a Paper credentials strip (4 columns with vertical dividers: Credential, Background, Investing since, Education), then a slim row: firm line + "View the firm record on IAPD →". Mobile: portrait 360px tall on top, then text; credentials as rows (includes "Firm CRD #342640").

### Contact (`/contact/`)
Minimal on purpose. Padding 120px 64px 128px, min-height ~660px, column with space-between: eyebrow "Contact" + H1 "Start a conversation." (72px). Below, a rail row with top hairline: left label "Write to me" (caps graphite); right: the paragraph (19px, max-width 600px) and a large mailto link `alan@threedotsadvisory.com →` (serif 600 40px, 2px brass bottom border, padding-bottom 10px, hover color `#9C7A38`).
`href="mailto:alan@threedotsadvisory.com?subject=Inquiry%20via%20threedotsadvisory.com"`. Mobile: H1 40px; the mailto becomes a full-width ink button. **No form, no phone, no address.**

## Interactions & behavior
- Navigation is ordinary links between pages. The current page is underlined in the header.
- Hover: nav links go brass; the outline button fills ink; primary buttons go `#000`; text links go brass.
- Mobile menu: toggles open/closed and closes on navigation.
- No animations required. Respect `prefers-reduced-motion` if you add any.
- External IAPD links: `target="_blank" rel="noopener"`.

## Design tokens
**Colors**
- Ink `#1A1712` — primary text, dark section, buttons
- Body text `#3A342A`, secondary body `#4A4436`, Graphite (labels) `#5B5445`
- Brass `#9C7A38` — eyebrows, numerals, underlines (≈5% of any surface)
- Brass on ink `#C79A4A`; Brass hover/dark `#6F551F`; Reserve swatch `#C6A968`
- Bone `#F5F1E9` (page), Sand `#EDE7DA` (alt sections), Paper `#FCFAF4` (panels)
- On-ink text `#F5F1E9` / `#D9D2C3` / `#C9C2B2` / `#B5AD9C` / `#9A9384`
- Placeholder text `#8A8062`. Hairlines `rgba(26,23,18,.10–.22)`; on ink `rgba(245,241,233,.14–.2)`

**Typography** (Google Fonts)
- Headings, numerals, values: **Source Serif 4** — 400 and 600 (opsz 8..60)
- Body and UI: **Hanken Grotesk** — 400/500/600/700
- Scale (desktop → mobile): Hero H1 66 → 36 (lh 1.02–1.05, ls −.022em); page H1 62/46/72 → 36/31/40; H2 38 → 26–27 (lh 1.16, ls −.012em); closing H2 48 → 30; card titles serif 600 18–22; lead 18 → 15.5; body 14.5–15.5 (lh 1.65–1.75); fine print 12–13.5
- Eyebrow: 11px (10.5 on mobile), uppercase, letter-spacing .22em (.2), 600, brass
- Labels: 10.5–11px uppercase, .14–.18em, 600, graphite
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.

**Spacing**: section padding 88–104px desktop / 44–56px mobile; side padding 64 / 22; grid gaps 24/28/36/40/48/64/80.
**Radius**: 0 everywhere. **Shadows**: none on site content.

## Assets
- `Photos/advisor-portrait-web.jpeg`: client's professional portrait (1000×1500, about 220 KB). Also generate 600w and 1200w WebP versions and use `srcset`.
- `assets/logo/`: existing wordmark (SVG) and signature PNG, for reference. The site header uses live text in Source Serif 4 rather than the image.
- Favicon: make a simple ink square with "TDA" in Source Serif 4 600, cream `#F5F1E9`, and a short brass rule beneath. Also produce `apple-touch-icon.png` (180px) and an Open Graph image (1200×630: bone background, wordmark, the hero H1).
- There are **no** decorative graphics, icons or dot motifs (the client asked that no "three dots" appear anywhere).

## SEO and production checklist
- Per-page `<title>` and meta description, for example "Three Dots Advisory | Fee-only investment adviser in Manhattan". Set the `lang="en"` attribute.
- Add `sitemap.xml`, `robots.txt` and a 404 page that uses the site's styling.
- Self-host the fonts or use Google Fonts with `display=swap`. Lighthouse scores should be at least 95.
- Accessibility: semantic landmarks, visible focus states (2px brass outline), alt text on the portrait, AA contrast (already met by the palette above).
- **No analytics, chat widgets or tracking** unless the client approves them and the privacy policy covers them.
- The client will supply the content for the `/privacy/` page.

## Deployment (GoDaddy domain)
1. Create a **private GitHub repo** (e.g. `threedotsadvisory-site`). Commit the built site.
2. **Cloudflare Pages** (preferred) or Netlify: connect the repo. Set a build command only if you use Astro or Eleventy, and an output directory. Every push to `main` deploys automatically, and every pull request gets a preview URL.
3. Custom domain: add `threedotsadvisory.com` and `www.threedotsadvisory.com` in Pages, then create the DNS records it lists in **GoDaddy → Domain → DNS**. Usually that's a CNAME for `www` pointing to the `*.pages.dev` host, plus an apex record (or forward the apex to `www`). Another option is to move the domain's nameservers to Cloudflare.
   **Don't change the MX, SPF, DKIM or DMARC records.** They carry alan@threedotsadvisory.com.
4. Redirect the apex domain to `www` (or the reverse) and force HTTPS.
5. Recordkeeping: the git history serves as a dated archive of every published version. Tag each release (e.g. `v2026.10.01`). The client may also archive the site with Smarsh.

## Open items to confirm with the client before launch
- The URL and content for the privacy policy page.
- Whether the Form ADV links should point to the client's own ADV PDFs instead of IAPD.
- The statement that IRAs use "a related model". Leave it as written unless the client changes it.
- Account types (individual, joint, IRA, trust) and the "Murray Hill, Manhattan" location.
- The Core & Overlay description must match the strategy disclosure in the client's Form ADV.

## Files in this bundle
- `README.md`: this file.
- `reference/three-dots-site-v2.dc.html`: the high-fidelity design reference, which holds all pages and all copy. Open it with `reference/support.js` next to it.
- `reference/brand-board.dc.html` + `reference/support-brand.js`: the brand language board (palette, type, chart and table styling, one-pager framework).
- `Photos/advisor-portrait-web.jpeg`: the portrait.
- `assets/logo/*`: the existing logo files.

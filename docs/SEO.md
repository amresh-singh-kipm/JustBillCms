# SEO in the JustBill CMS

This Payload app publishes the blog and CMS-managed pages on **justbill.ai itself**, next to the React app. It does not use a subdomain, so links to the blog build authority for the main domain. The React app keeps its prerendered marketing pages. The CMS adds content marketing on top.

## URL map

| URL | Served by | Notes |
|---|---|---|
| `/`, `/features`, `/gst-billing-software`, `/hi/...` | React app (prerendered) | Unchanged. |
| `/blog`, `/blog/<slug>`, `/blog/page/<n>`, `/blog/category/<slug>` | CMS | Posts collection. |
| `/blog/feed.xml` | CMS | RSS 2.0, advertised in every page head. |
| `/<slug>` for any CMS page | CMS | Only when no prerendered React page has that path. The `home` page is never served. `/home` 308s to `/`. |
| `/cms`, `/cms-api/...` | CMS | Admin and REST API. They were moved off `/admin` and `/api`, which the React app and Laravel already use. Both are noindexed and disallowed in robots.txt. |
| `/cms-sitemap.xml` | CMS | Sitemap index linking `/blog-sitemap.xml` and `/pages-sitemap.xml`. |

All paths come from `src/utilities/paths.ts`. Change them there only.

Nginx routing lives in the platform repo at `justbill/docs/deploy/nginx-justbill.conf`. The React build's robots.txt already lists `/cms-sitemap.xml`.

## What editors control

**Per page and per post, in the SEO tab:**
- Meta title and description, with generate buttons, a length checker and a Google preview (from `@payloadcms/plugin-seo`).
- Social image. The fallback order is the post hero image, then the site default, then `/og-default.png`.
- **Advanced → Hide from search engines** sets noindex and removes the URL from the sitemap.
- **Advanced → Canonical URL override** is only for syndicated or duplicate content. The URL is then left out of the sitemap.

**Site settings (SEO)**, a global under Settings, controls:
- The site name, the default title and description, the blog description, the default share image and the X handle.
- The Organization details: legal name, logo, email, phone and official profile URLs.
- Google Search Console and Bing verification tokens.
- A GA4 measurement ID. It is skipped in preview mode.
- A switch to noindex the whole CMS. Use it for staging only.

**FAQ block.** It is available in page layouts and inside post rich text. It renders an accordion and emits `FAQPage` structured data.

**Redirects**, in the Redirects collection, are issued as permanent 308 redirects. Add one whenever a slug changes.

## What is automatic

- A self-referencing canonical, `robots` meta, Open Graph and Twitter tags on every route. Blog posts use `og:type=article` with published, modified, section and tag values.
- Structured data:
  - Organization and WebSite on every page.
  - WebPage and BreadcrumbList on CMS pages.
  - BlogPosting, with word count and categories, and BreadcrumbList on posts.
  - Blog on `/blog`.
  - CollectionPage on category archives.
- Sitemaps list only published, indexable posts and pages. They also list categories that have posts. Each entry has a real `lastmod`. Sitemaps refresh when content is published, unpublished, deleted, or has its slug changed.
- `/blog/page/1` redirects to `/blog`. Category and pagination pages past the end return 404 instead of empty pages.
- `/search` is `noindex, follow`.

## Deploying

1. Set `NEXT_PUBLIC_SERVER_URL=https://justbill.ai` in the CMS environment. Canonicals, OG URLs and sitemaps are built from it.
2. Run `npm run build && npm start` on the port named in the nginx `upstream justbill_cms`.
3. Apply the updated nginx config from the platform repo and run the curl checks at the bottom of it.
4. In Google Search Console, submit `https://justbill.ai/cms-sitemap.xml` next to `/sitemap.xml`.
5. In the admin, open **Settings → Site settings (SEO)**. Fill in the Organization details and the verification token, then save.

Schema changes in this work are the Site settings global, the FAQ block and the `meta.noIndex` and `meta.canonicalUrl` fields. SQLite dev mode pushes them automatically. For a production database, create and run a migration with `npx payload migrate:create` and `npx payload migrate`.

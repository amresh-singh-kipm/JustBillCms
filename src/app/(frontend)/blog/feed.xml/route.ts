import { absUrl } from '@/seo/jsonLd'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { BLOG_PATH, postPath } from '@/utilities/paths'
import { queryPublishedPosts } from '@/utilities/queryPosts'

/** RSS 2.0 feed of the latest posts, advertised from every page's <head>. */
export const revalidate = 600

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export async function GET() {
  const [posts, settings] = await Promise.all([queryPublishedPosts(), getSiteSettings()])
  const items = posts.docs
    .filter((p) => p.slug && !p.meta?.noIndex)
    .map((p) => {
      const url = absUrl(postPath(p.slug))
      return [
        '    <item>',
        `      <title>${esc(p.title)}</title>`,
        `      <link>${esc(url)}</link>`,
        `      <guid isPermaLink="true">${esc(url)}</guid>`,
        p.publishedAt ? `      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : '',
        p.meta?.description ? `      <description>${esc(p.meta.description)}</description>` : '',
        ...(p.categories ?? [])
          .map((c) =>
            typeof c === 'object' && c ? `      <category>${esc(c.title)}</category>` : '',
          )
          .filter(Boolean),
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n')
    })

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(settings.siteName)} Blog</title>
    <link>${esc(absUrl(BLOG_PATH))}</link>
    <description>${esc(settings.blogDescription ?? settings.defaultDescription)}</description>
    <language>en-in</language>
    <atom:link href="${esc(absUrl(`${BLOG_PATH}/feed.xml`))}" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>
`
  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}

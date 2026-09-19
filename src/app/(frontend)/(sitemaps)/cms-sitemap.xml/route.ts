import { absUrl } from '@/seo/jsonLd'

/**
 * Sitemap index for everything the CMS serves. The main app's robots.txt
 * points crawlers here alongside its own /sitemap.xml.
 */
export const dynamic = 'force-static'
export const revalidate = 3600

export function GET() {
  const now = new Date().toISOString()
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${absUrl('/blog-sitemap.xml')}</loc><lastmod>${now}</lastmod></sitemap>
  <sitemap><loc>${absUrl('/pages-sitemap.xml')}</loc><lastmod>${now}</lastmod></sitemap>
</sitemapindex>
`
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

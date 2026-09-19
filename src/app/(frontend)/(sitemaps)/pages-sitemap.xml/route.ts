import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { absUrl } from '@/seo/jsonLd'
import { HOME_SLUG, pagePath } from '@/utilities/paths'

/**
 * CMS pages. The site root is owned by the main justbill.ai app (its own
 * sitemap lists it), so the CMS `home` page is left out here.
 */
const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        and: [
          { _status: { equals: 'published' } },
          { slug: { not_equals: HOME_SLUG } },
          { 'meta.noIndex': { not_equals: true } },
          // A canonical override means this URL is a duplicate; list the original instead.
          {
            or: [
              { 'meta.canonicalUrl': { exists: false } },
              { 'meta.canonicalUrl': { equals: '' } },
            ],
          },
        ],
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    return results.docs
      .filter((page) => Boolean(page?.slug))
      .map((page) => ({
        loc: absUrl(pagePath(page.slug)),
        lastmod: page.updatedAt || new Date().toISOString(),
        changefreq: 'monthly' as const,
        priority: 0.7,
      }))
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}

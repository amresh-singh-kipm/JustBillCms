import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { absUrl } from '@/seo/jsonLd'
import { BLOG_PATH, categoryPath, postPath } from '@/utilities/paths'

/** Blog index, every indexable published post, and categories that have posts. */
const getBlogSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })

    const posts = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 5000,
      pagination: false,
      sort: '-publishedAt',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { 'meta.noIndex': { not_equals: true } },
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
        categories: true,
      },
    })

    const now = new Date().toISOString()
    const docs = posts.docs.filter((post) => Boolean(post?.slug))
    const newest = docs.reduce(
      (max, p) => (p.updatedAt && p.updatedAt > max ? p.updatedAt : max),
      '',
    )

    const usedCategoryIds = new Set(
      docs.flatMap((p) => (p.categories ?? []).map((c) => (typeof c === 'object' && c ? c.id : c))),
    )
    const categories = usedCategoryIds.size
      ? await payload.find({
          collection: 'categories',
          depth: 0,
          limit: 1000,
          pagination: false,
          where: { id: { in: [...usedCategoryIds] } },
          select: { slug: true, updatedAt: true },
        })
      : { docs: [] }

    return [
      {
        loc: absUrl(BLOG_PATH),
        lastmod: newest || now,
        changefreq: 'daily' as const,
        priority: 0.8,
      },
      ...docs.map((post) => ({
        loc: absUrl(postPath(post.slug)),
        lastmod: post.updatedAt || now,
        changefreq: 'monthly' as const,
        priority: 0.7,
      })),
      ...categories.docs
        .filter((c) => c.slug)
        .map((c) => ({
          loc: absUrl(categoryPath(c.slug)),
          lastmod: newest || c.updatedAt || now,
          changefreq: 'weekly' as const,
          priority: 0.5,
        })),
    ]
  },
  ['blog-sitemap'],
  {
    tags: ['blog-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getBlogSitemap()

  return getServerSideSitemap(sitemap)
}

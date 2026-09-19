import type { Metadata } from 'next'

import type { Media, Page, Post, SiteSetting } from '../payload-types'

import { absUrl, mediaUrl } from '@/seo/jsonLd'
import { getSiteSettings } from './getSiteSettings'
import { BLOG_PATH, pagePath, postPath } from './paths'

const FALLBACK_OG = '/og-default.png'

type MetaDoc = Partial<Page> | Partial<Post>

/** "Title | JustBill", without doubling the suffix editors often type themselves. */
export function withSiteName(title: string, siteName: string): string {
  const suffix = ` | ${siteName}`
  return title.endsWith(suffix) || title === siteName ? title : `${title}${suffix}`
}

function ogImageFor(image: Media | number | string | null | undefined, settings: SiteSetting) {
  return mediaUrl(image, 'og') ?? mediaUrl(settings.defaultImage, 'og') ?? absUrl(FALLBACK_OG)
}

/**
 * Metadata for any SEO-able route. `path` is the public path of this URL
 * (used for the self-referencing canonical and og:url).
 */
export async function buildMetadata(args: {
  path: string
  title?: string | null
  description?: string | null
  image?: Media | number | string | null
  noIndex?: boolean | null
  canonicalUrl?: string | null
  type?: 'website' | 'article'
  publishedTime?: string | null
  modifiedTime?: string | null
  authors?: string[]
  section?: string[]
}): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = args.title ? withSiteName(args.title, settings.siteName) : settings.defaultTitle
  const description = args.description || settings.defaultDescription
  const url = absUrl(args.path)
  const canonical = args.canonicalUrl || url
  const image = ogImageFor(args.image, settings)
  const noIndex = Boolean(args.noIndex || settings.noIndexSite)

  return {
    // `absolute` stops the root layout's title template being applied twice.
    title: { absolute: title },
    description,
    // Page-level `alternates` replaces the layout's, so the feed link is repeated here.
    alternates: {
      ...(noIndex ? {} : { canonical }),
      types: {
        'application/rss+xml': [
          { url: `${BLOG_PATH}/feed.xml`, title: `${settings.siteName} Blog` },
        ],
      },
    },
    robots: noIndex
      ? { index: false, follow: !settings.noIndexSite }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        },
    openGraph: {
      type: args.type ?? 'website',
      siteName: settings.siteName,
      locale: 'en_IN',
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(args.type === 'article'
        ? {
            publishedTime: args.publishedTime ?? undefined,
            modifiedTime: args.modifiedTime ?? undefined,
            authors: args.authors,
            section: args.section?.[0],
            tags: args.section,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      ...(settings.twitterHandle ? { site: `@${settings.twitterHandle.replace(/^@/, '')}` } : {}),
    },
  }
}

/** Metadata for a page or post document from the plugin-seo `meta` group. */
export const generateMeta = async (args: {
  doc: MetaDoc | null
  collection?: 'pages' | 'posts'
}): Promise<Metadata> => {
  const { doc, collection = 'pages' } = args
  const isPost = collection === 'posts'
  const post = isPost ? (doc as Partial<Post> | null) : null

  const categories = (post?.categories ?? [])
    .map((c) => (typeof c === 'object' && c ? c.title : null))
    .filter((t): t is string => Boolean(t))

  return buildMetadata({
    path: isPost ? postPath(doc?.slug) : pagePath(doc?.slug),
    title: doc?.meta?.title || doc?.title,
    description: doc?.meta?.description,
    image: doc?.meta?.image ?? post?.heroImage,
    noIndex: doc?.meta?.noIndex,
    canonicalUrl: doc?.meta?.canonicalUrl,
    type: isPost ? 'article' : 'website',
    publishedTime: doc?.publishedAt,
    modifiedTime: doc?.updatedAt,
    authors: post?.populatedAuthors?.map((a) => a.name).filter((n): n is string => Boolean(n)),
    section: categories,
  })
}

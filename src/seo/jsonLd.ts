import type { Category, Media, Page, Post, SiteSetting } from '@/payload-types'

import { getServerSideURL } from '@/utilities/getURL'
import { BLOG_PATH, pagePath, postPath } from '@/utilities/paths'

/**
 * schema.org builders. Each returns a plain object; render with <JsonLd />.
 * Organization and WebSite get stable `@id`s so other nodes can reference them.
 */

export const absUrl = (path: string): string => {
  if (/^https?:\/\//.test(path)) return path
  const origin = getServerSideURL().replace(/\/$/, '')
  return `${origin}${path.startsWith('/') ? '' : '/'}${path}`
}

export const mediaUrl = (
  media?: Media | number | string | null,
  size?: 'og',
): string | undefined => {
  if (!media || typeof media !== 'object') return undefined
  const sized = size ? media.sizes?.[size]?.url : undefined
  const url = sized || media.url
  return url ? absUrl(url) : undefined
}

export const organizationId = () => `${absUrl('/')}#organization`
export const websiteId = () => `${absUrl('/')}#website`

export function organizationJsonLd(settings: SiteSetting) {
  const org = settings.organization
  const sameAs = (org?.sameAs ?? []).map((s) => s.url).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId(),
    name: settings.siteName,
    ...(org?.legalName ? { legalName: org.legalName } : {}),
    url: absUrl('/'),
    logo: mediaUrl(org?.logo) ?? absUrl('/icons/icon-512.png'),
    ...(org?.email ? { email: org.email } : {}),
    ...(org?.phone ? { telephone: org.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

export function websiteJsonLd(settings: SiteSetting) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(),
    name: settings.siteName,
    url: absUrl('/'),
    inLanguage: 'en-IN',
    publisher: { '@id': organizationId() },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  }
}

export function webPageJsonLd(page: Page) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    ...(page.meta?.description ? { description: page.meta.description } : {}),
    url: absUrl(pagePath(page.slug)),
    inLanguage: 'en-IN',
    isPartOf: { '@id': websiteId() },
    publisher: { '@id': organizationId() },
    ...(page.publishedAt ? { datePublished: page.publishedAt } : {}),
    dateModified: page.updatedAt,
  }
}

export function blogPostingJsonLd(post: Post, settings: SiteSetting, words?: number) {
  const image = mediaUrl(post.meta?.image, 'og') ?? mediaUrl(post.heroImage, 'og')
  const authors = (post.populatedAuthors ?? [])
    .filter((a) => a.name)
    .map((a) => ({ '@type': 'Person', name: a.name }))
  const categories = (post.categories ?? []).filter(
    (c): c is Category => typeof c === 'object' && c !== null,
  )
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    ...(post.meta?.description ? { description: post.meta.description } : {}),
    url: absUrl(postPath(post.slug)),
    mainEntityOfPage: absUrl(postPath(post.slug)),
    ...(image ? { image } : {}),
    inLanguage: 'en-IN',
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt,
    author: authors.length ? authors : { '@id': organizationId() },
    publisher: {
      '@type': 'Organization',
      '@id': organizationId(),
      name: settings.siteName,
      logo: mediaUrl(settings.organization?.logo) ?? absUrl('/icons/icon-512.png'),
    },
    isPartOf: { '@id': `${absUrl(BLOG_PATH)}#blog` },
    ...(categories.length ? { articleSection: categories.map((c) => c.title) } : {}),
    ...(words ? { wordCount: words } : {}),
  }
}

export function blogJsonLd(
  settings: SiteSetting,
  description: string,
  posts: Pick<Post, 'slug' | 'title'>[] = [],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${absUrl(BLOG_PATH)}#blog`,
    name: `${settings.siteName} Blog`,
    description,
    url: absUrl(BLOG_PATH),
    inLanguage: 'en-IN',
    publisher: { '@id': organizationId() },
    isPartOf: { '@id': websiteId() },
    ...(posts.length
      ? {
          blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: absUrl(postPath(p.slug)),
          })),
        }
      : {}),
  }
}

export function collectionPageJsonLd(name: string, path: string, description?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    ...(description ? { description } : {}),
    url: absUrl(path),
    inLanguage: 'en-IN',
    isPartOf: { '@id': websiteId() },
  }
}

/** FAQPage from plain-text Q&A pairs; flatten rich text first. */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

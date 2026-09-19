/**
 * Public URL structure of the CMS-served part of justbill.ai.
 *
 * The CMS shares the justbill.ai origin with the main app (see docs/SEO.md):
 *   /blog, /blog/<slug>, /blog/page/<n>, /blog/category/<slug>   -> posts
 *   /<slug>                                                       -> CMS pages
 *   /cms, /cms-api                                                -> Payload admin + REST
 * Every path that ends up in an href, canonical, sitemap or revalidatePath()
 * call goes through these helpers so the structure is defined once.
 */

export const BLOG_PATH = '/blog'
export const ADMIN_PATH = '/cms'
export const API_PATH = '/cms-api'

/** Slug that maps to the site root. */
export const HOME_SLUG = 'home'

export function pagePath(slug?: string | null): string {
  if (!slug || slug === HOME_SLUG) return '/'
  return `/${slug}`
}

export function postPath(slug?: string | null): string {
  return `${BLOG_PATH}/${slug ?? ''}`
}

export function blogPagePath(page: number): string {
  return page <= 1 ? BLOG_PATH : `${BLOG_PATH}/page/${page}`
}

export function categoryPath(slug?: string | null): string {
  return `${BLOG_PATH}/category/${slug ?? ''}`
}

/** Path for a document referenced from a link, redirect or rich-text relationship. */
export function docPath(relationTo: string | undefined | null, slug?: string | null): string {
  return relationTo === 'posts' ? postPath(slug) : pagePath(slug)
}

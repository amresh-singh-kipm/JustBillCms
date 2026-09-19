import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'

export const POSTS_PER_PAGE = 12

/** Published posts, newest first, for the blog index, its pages and category archives. */
export async function queryPublishedPosts(args: { page?: number; where?: Where } = {}) {
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'posts',
    depth: 1,
    limit: POSTS_PER_PAGE,
    page: args.page ?? 1,
    overrideAccess: false,
    sort: '-publishedAt',
    where: {
      and: [{ _status: { equals: 'published' } }, ...(args.where ? [args.where] : [])],
    },
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      publishedAt: true,
    },
  })
}

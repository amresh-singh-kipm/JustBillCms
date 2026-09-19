import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'
import { BLOG_PATH, postPath } from '@/utilities/paths'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = postPath(doc.slug)

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidatePath(BLOG_PATH, 'layout')
      revalidateTag('blog-sitemap', 'max')

      // A changed slug leaves the old URL behind; refresh it so it stops serving.
      if (previousDoc?.slug && previousDoc.slug !== doc.slug)
        revalidatePath(postPath(previousDoc.slug))
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = postPath(previousDoc.slug)

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath(BLOG_PATH, 'layout')
      revalidateTag('blog-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidatePath(postPath(doc?.slug))
    revalidatePath(BLOG_PATH, 'layout')
    revalidateTag('blog-sitemap', 'max')
  }

  return doc
}

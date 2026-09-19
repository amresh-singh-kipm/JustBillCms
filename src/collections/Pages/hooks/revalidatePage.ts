import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '../../../payload-types'
import { pagePath } from '@/utilities/paths'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = pagePath(doc.slug)

      payload.logger.info(`Revalidating page at path: ${path}`)

      revalidatePath(path)
      revalidateTag('pages-sitemap', 'max')

      if (previousDoc?.slug && previousDoc.slug !== doc.slug)
        revalidatePath(pagePath(previousDoc.slug))
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = pagePath(previousDoc.slug)

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('pages-sitemap', 'max')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = pagePath(doc?.slug)
    revalidatePath(path)
    revalidateTag('pages-sitemap', 'max')
  }

  return doc
}

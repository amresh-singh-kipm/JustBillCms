import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'
import { BLOG_PATH } from '../utilities/paths'

const revalidateBlog = ({
  doc,
  req: { context },
}: {
  doc: unknown
  req: { context: Record<string, unknown> }
}) => {
  if (!context.disableRevalidate) {
    revalidateTag('blog-sitemap', 'max')
    revalidatePath(BLOG_PATH, 'layout')
  }
  return doc
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    description: 'Each category with published posts gets an archive at /blog/category/<slug>.',
  },
  hooks: {
    afterChange: [revalidateBlog],
    afterDelete: [revalidateBlog],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      position: undefined,
    }),
  ],
}

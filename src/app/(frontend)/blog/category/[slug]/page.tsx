import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CollectionArchive } from '@/components/CollectionArchive'
import { JsonLd } from '@/components/JsonLd'
import { collectionPageJsonLd } from '@/seo/jsonLd'
import { buildMetadata } from '@/utilities/generateMeta'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { BLOG_PATH, categoryPath } from '@/utilities/paths'
import { queryPublishedPosts } from '@/utilities/queryPosts'
import PageClient from '../../page.client'

export const revalidate = 600

type Args = { params: Promise<{ slug: string }> }

const getCategory = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'categories',
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return res.docs[0] ?? null
})

export default async function CategoryPage({ params }: Args) {
  const { slug } = await params
  const category = await getCategory(decodeURIComponent(slug))
  if (!category) notFound()

  // First page only; categories rarely outgrow it and deeper paging adds thin URLs.
  const posts = await queryPublishedPosts({ where: { categories: { in: [category.id] } } })
  if (posts.totalDocs === 0) notFound()

  const settings = await getSiteSettings()
  const path = categoryPath(category.slug)
  const description = `${category.title} articles from the ${settings.siteName} blog.`

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <JsonLd
        data={collectionPageJsonLd(
          `${category.title} | ${settings.siteName} Blog`,
          path,
          description,
        )}
      />
      <Breadcrumbs
        className="mb-8"
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: BLOG_PATH },
          { name: category.title, path },
        ]}
      />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{category.title}</h1>
        </div>
      </div>
      <CollectionArchive posts={posts.docs} />
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(decodeURIComponent(slug))
  const settings = await getSiteSettings()
  if (!category) return { robots: { index: false } }
  return buildMetadata({
    path: categoryPath(category.slug),
    title: `${category.title} articles`,
    description: `Guides and explainers about ${category.title.toLowerCase()} from the ${settings.siteName} blog.`,
  })
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'categories',
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })
  return res.docs.filter((c) => c.slug).map((c) => ({ slug: c.slug as string }))
}

import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { notFound, permanentRedirect } from 'next/navigation'
import { buildMetadata } from '@/utilities/generateMeta'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { BLOG_PATH, blogPagePath } from '@/utilities/paths'
import { POSTS_PER_PAGE, queryPublishedPosts } from '@/utilities/queryPosts'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const page = Number(pageNumber)

  if (!Number.isInteger(page) || page < 1) notFound()
  // /blog/page/1 duplicates /blog.
  if (page === 1) permanentRedirect(BLOG_PATH)

  const [posts, settings] = await Promise.all([queryPublishedPosts({ page }), getSiteSettings()])
  if (page > Math.max(posts.totalPages, 1)) notFound()

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>
            {settings.siteName} Blog: page {page}
          </h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={POSTS_PER_PAGE}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className="container">
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  const settings = await getSiteSettings()
  const page = Number(pageNumber) || 1
  return buildMetadata({
    path: blogPagePath(page),
    title: `Blog: page ${page}`,
    description: settings.blogDescription,
  })
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
    where: { _status: { equals: 'published' } },
  })

  const totalPages = Math.ceil(totalDocs / POSTS_PER_PAGE)

  const pages: { pageNumber: string }[] = []

  for (let i = 2; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}

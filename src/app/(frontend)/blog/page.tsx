import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { JsonLd } from '@/components/JsonLd'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { blogJsonLd, breadcrumbJsonLd } from '@/seo/jsonLd'
import { buildMetadata } from '@/utilities/generateMeta'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { BLOG_PATH } from '@/utilities/paths'
import { POSTS_PER_PAGE, queryPublishedPosts } from '@/utilities/queryPosts'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const [posts, settings] = await Promise.all([queryPublishedPosts(), getSiteSettings()])

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <JsonLd
        data={[
          blogJsonLd(settings, settings.blogDescription ?? '', posts.docs),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: BLOG_PATH },
          ]),
        ]}
      />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{settings.siteName} Blog</h1>
          {settings.blogDescription && <p className="lead">{settings.blogDescription}</p>}
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
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({
    path: BLOG_PATH,
    title: 'Blog: GST, Invoicing & Accounting Guides',
    description: settings.blogDescription,
  })
}

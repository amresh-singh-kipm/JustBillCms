import type React from 'react'
import type { Page, Post } from '@/payload-types'

import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, permanentRedirect } from 'next/navigation'
import { docPath } from '@/utilities/paths'

interface Props {
  disableNotFound?: boolean
  url: string
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    // Permanent (308) so search engines move ranking signals to the new URL.
    if (redirectItem.to?.url) {
      permanentRedirect(redirectItem.to.url)
    }

    let redirectUrl: string

    if (typeof redirectItem.to?.reference?.value === 'string') {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      const document = (await getCachedDocument(collection, id)()) as Page | Post
      redirectUrl = docPath(collection, document?.slug)
    } else {
      redirectUrl = docPath(
        redirectItem.to?.reference?.relationTo,
        typeof redirectItem.to?.reference?.value === 'object'
          ? redirectItem.to?.reference?.value?.slug
          : '',
      )
    }

    if (redirectUrl) permanentRedirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}

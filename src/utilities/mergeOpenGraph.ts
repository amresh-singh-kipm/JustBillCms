import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'en_IN',
  description:
    'GST billing and accounting software for India: invoices, e-invoices, e-way bills and GSTR-ready reports.',
  images: [
    {
      url: `${getServerSideURL()}/og-default.png`,
      width: 1200,
      height: 630,
    },
  ],
  siteName: 'JustBill',
  title: 'JustBill',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

import type { Metadata, Viewport } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { Inter_Tight, Sora } from 'next/font/google'
import Script from 'next/script'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { JsonLd } from '@/components/JsonLd'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { organizationJsonLd, websiteJsonLd } from '@/seo/jsonLd'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const sora = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-sora',
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter-tight',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const settings = await getSiteSettings()
  const ga4 = settings.analytics?.ga4MeasurementId

  return (
    <html
      className={cn(sora.variable, interTight.variable, GeistMono.variable)}
      data-theme="dark"
      lang="en-IN"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <JsonLd data={[organizationJsonLd(settings), websiteJsonLd(settings)]} />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
        {ga4 && !isEnabled && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(ga4)});`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}

export const viewport: Viewport = {
  themeColor: '#0b0b1a',
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    metadataBase: new URL(getServerSideURL()),
    applicationName: settings.siteName,
    title: {
      default: settings.defaultTitle,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.defaultDescription,
    openGraph: mergeOpenGraph({ siteName: settings.siteName }),
    twitter: {
      card: 'summary_large_image',
      ...(settings.twitterHandle ? { site: `@${settings.twitterHandle.replace(/^@/, '')}` } : {}),
    },
    verification: {
      ...(settings.verification?.google ? { google: settings.verification.google } : {}),
      ...(settings.verification?.bing
        ? { other: { 'msvalidate.01': settings.verification.bing } }
        : {}),
    },
    alternates: {
      types: {
        'application/rss+xml': [{ url: '/blog/feed.xml', title: `${settings.siteName} Blog` }],
      },
    },
    ...(settings.noIndexSite ? { robots: { index: false, follow: false } } : {}),
  }
}

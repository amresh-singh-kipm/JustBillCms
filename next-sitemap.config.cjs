const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  // Everything is listed by the dynamic sitemaps under /cms-sitemap.xml.
  exclude: ['/*'],
  // Only used when the CMS runs on its own host. On justbill.ai the main app
  // serves robots.txt and already points at /cms-sitemap.xml.
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cms', '/cms-api/', '/next/', '/search'],
      },
    ],
    additionalSitemaps: [`${SITE_URL}/cms-sitemap.xml`],
  },
}

import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

/**
 * Site-wide SEO defaults, editable without a deploy: default meta, social
 * image, Organization schema, search-console verification and analytics.
 * Read through getCachedGlobal('site-settings') in the root layout.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings (SEO)',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Defaults',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'JustBill',
              admin: {
                description:
                  'Appended to page titles as "Page title | Site name" and used as og:site_name.',
              },
            },
            {
              name: 'defaultTitle',
              type: 'text',
              required: true,
              defaultValue: 'GST Billing & Accounting Software for India | JustBill',
              admin: {
                description:
                  'Used when a page has no SEO title of its own. Keep it under 60 characters.',
              },
            },
            {
              name: 'defaultDescription',
              type: 'textarea',
              required: true,
              defaultValue:
                'Create GST invoices, e-invoices and e-way bills, track stock and payments, and get GSTR-ready reports. Start free with JustBill, no credit card needed.',
              admin: {
                description:
                  'Used when a page has no meta description. Aim for 120 to 160 characters.',
              },
            },
            {
              name: 'blogDescription',
              type: 'textarea',
              defaultValue:
                'Practical guides on GST invoicing, e-invoicing, e-way bills, GST returns and running the accounts of a small Indian business.',
              admin: {
                description: 'Meta description for the /blog index and its paginated pages.',
              },
            },
            {
              name: 'defaultImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Default social share image (1200x630). Falls back to /og-default.png when empty.',
              },
            },
            {
              name: 'twitterHandle',
              type: 'text',
              admin: { description: 'Without the @. Leave empty if there is no account.' },
            },
          ],
        },
        {
          label: 'Organization',
          description:
            'Rendered as schema.org Organization and WebSite structured data on every page.',
          fields: [
            {
              name: 'organization',
              type: 'group',
              fields: [
                {
                  name: 'legalName',
                  type: 'text',
                  admin: { description: 'Registered company name.' },
                },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description:
                      'Square logo, at least 112x112. Falls back to /icons/icon-512.png on justbill.ai.',
                  },
                },
                { name: 'email', type: 'email' },
                {
                  name: 'phone',
                  type: 'text',
                  admin: { description: 'International format, e.g. +91 98765 43210.' },
                },
                {
                  name: 'sameAs',
                  type: 'array',
                  label: 'Official profiles',
                  admin: {
                    description:
                      'Full URLs of official profiles: LinkedIn, X, YouTube, Instagram, app store listings.',
                  },
                  fields: [{ name: 'url', type: 'text', required: true }],
                },
              ],
            },
          ],
        },
        {
          label: 'Verification & analytics',
          fields: [
            {
              name: 'verification',
              type: 'group',
              fields: [
                {
                  name: 'google',
                  type: 'text',
                  label: 'Google Search Console token',
                  admin: {
                    description:
                      'The content value of the google-site-verification meta tag (HTML tag method).',
                  },
                },
                { name: 'bing', type: 'text', label: 'Bing Webmaster token (msvalidate.01)' },
              ],
            },
            {
              name: 'analytics',
              type: 'group',
              fields: [
                {
                  name: 'ga4MeasurementId',
                  type: 'text',
                  label: 'GA4 measurement ID',
                  admin: {
                    description:
                      'e.g. G-XXXXXXXXXX. Loaded after the page is interactive. Empty disables it.',
                  },
                  validate: (value: unknown) =>
                    !value || /^G-[A-Z0-9]+$/.test(String(value)) || 'Must look like G-XXXXXXXXXX',
                },
              ],
            },
          ],
        },
        {
          label: 'Crawling',
          fields: [
            {
              name: 'noIndexSite',
              type: 'checkbox',
              label: 'Hide the whole CMS site from search engines',
              defaultValue: false,
              admin: {
                description:
                  'Adds a noindex, nofollow robots tag to every CMS page. Turn on for staging or preview deployments only.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}

import type { Field } from 'payload'

/**
 * Per-document crawl controls shown in the SEO tab of pages and posts, next to
 * the plugin-seo fields (they live in the same `meta` group).
 */
export const seoExtraFields: Field[] = [
  {
    type: 'collapsible',
    label: 'Advanced',
    admin: { initCollapsed: true },
    fields: [
      {
        name: 'noIndex',
        type: 'checkbox',
        label: 'Hide from search engines (noindex)',
        defaultValue: false,
        admin: {
          description:
            'Adds a noindex robots tag and leaves this URL out of the sitemap. Use for thank-you pages, campaign landers or thin duplicates.',
        },
      },
      {
        name: 'canonicalUrl',
        type: 'text',
        label: 'Canonical URL override',
        admin: {
          description:
            'Only when this content is a copy of a page elsewhere, such as a syndicated article. Leave empty to use this URL.',
        },
        hooks: {
          // A cleared field must read as unset, not '', or sitemap filters treat it as an override.
          beforeChange: [
            ({ value }) => (typeof value === 'string' && value.trim() ? value.trim() : null),
          ],
        },
        validate: (value: unknown) => {
          if (!value) return true
          try {
            const u = new URL(String(value))
            return (
              u.protocol === 'https:' || u.protocol === 'http:' || 'Must be an absolute http(s) URL'
            )
          } catch {
            return 'Must be an absolute http(s) URL'
          }
        },
      },
    ],
  },
]

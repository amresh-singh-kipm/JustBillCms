import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

/**
 * Question and answer list, rendered as an accordion and emitted as FAQPage
 * structured data.
 */
export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Frequently asked questions',
      admin: { description: 'Rendered as an H2. Leave empty to hide.' },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Question', plural: 'Questions' },
      admin: { initCollapsed: true },
      fields: [
        { name: 'question', type: 'text', required: true },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
    {
      name: 'emitSchema',
      type: 'checkbox',
      label: 'Emit FAQPage structured data',
      defaultValue: true,
      admin: {
        description:
          'Turn off when the same questions already appear in another FAQ block on this page.',
      },
    },
  ],
}

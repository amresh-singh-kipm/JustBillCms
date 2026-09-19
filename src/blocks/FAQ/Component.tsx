import React from 'react'

import type { FAQBlock as FAQBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { JsonLd } from '@/components/JsonLd'
import { faqJsonLd } from '@/seo/jsonLd'
import { lexicalToPlainText } from '@/utilities/lexicalToPlainText'
import { cn } from '@/utilities/ui'

export const FAQBlock: React.FC<
  FAQBlockProps & { className?: string; disableInnerContainer?: boolean }
> = ({ className, heading, items, emitSchema, disableInnerContainer }) => {
  const list = (items ?? []).filter((it) => it.question && it.answer)
  if (list.length === 0) return null

  return (
    <section className={cn({ container: !disableInnerContainer }, className)}>
      <div className="mx-auto max-w-[48rem]">
        {heading && <h2 className="mb-6 text-2xl font-semibold md:text-3xl">{heading}</h2>}
        <div className="divide-y divide-border rounded-2xl border border-border">
          {list.map((it, i) => (
            <details key={it.id ?? i} className="group px-5 py-4 open:bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h3 className="m-0 text-base font-medium">{it.question}</h3>
                <span aria-hidden className="text-xl leading-none transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="pt-3">
                <RichText data={it.answer} enableGutter={false} />
              </div>
            </details>
          ))}
        </div>
      </div>
      {emitSchema !== false && (
        <JsonLd
          data={faqJsonLd(
            list.map((it) => ({ question: it.question, answer: lexicalToPlainText(it.answer) })),
          )}
        />
      )}
    </section>
  )
}

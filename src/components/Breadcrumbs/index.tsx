import Link from 'next/link'
import React from 'react'

import { JsonLd } from '@/components/JsonLd'
import { breadcrumbJsonLd } from '@/seo/jsonLd'
import { cn } from '@/utilities/ui'

export type Crumb = { name: string; path: string }

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. */
export const Breadcrumbs: React.FC<{ items: Crumb[]; className?: string }> = ({
  items,
  className,
}) => {
  if (items.length < 2) return null
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn('container text-xs text-slate-400', className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((it, i) => {
            const last = i === items.length - 1
            return (
              <li key={it.path} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="text-slate-300">
                    {it.name}
                  </span>
                ) : (
                  <Link className="transition hover:text-white" href={it.path}>
                    {it.name}
                  </Link>
                )}
                {!last && <span aria-hidden>/</span>}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  )
}

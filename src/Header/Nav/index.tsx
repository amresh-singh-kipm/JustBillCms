'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="hidden items-center gap-1 text-xs font-medium md:flex">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="inline"
            className="rounded-lg px-3 py-1.5 text-slate-300 transition hover:bg-white/5 hover:text-white"
          />
        )
      })}
    </nav>
  )
}

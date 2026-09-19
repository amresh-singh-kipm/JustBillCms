import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const groups = footerData?.groups || []

  return (
    <footer className="mt-auto border-t border-white/10 bg-slate-950 py-12 text-slate-300">
      <div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-1">
          <Link className="flex items-center gap-2" href="/">
            <Logo size={28} />
          </Link>
          <p className="mt-3 text-xs leading-5 text-slate-500">GST billing and accounting for Indian businesses.</p>
        </div>

        {groups.map((group, i) => {
          const navItems = group.navItems || []
          if (navItems.length === 0) return null
          return (
            <div key={i}>
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{group.title}</h2>
              <ul className="mt-3 space-y-2 text-xs">
                {navItems.map(({ link }, j) => (
                  <li key={j}>
                    <CMSLink appearance="inline" className="text-slate-500 transition hover:text-white" {...link} />
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
      <div className="container mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} JustBill</span>
      </div>
    </footer>
  )
}

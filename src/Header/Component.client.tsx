'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

/** Where visitors sign in / sign up — the main JustBill product, not this marketing site. */
const APP_URL = 'https://justbill.ai'

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={
        'fixed left-1/2 z-50 -translate-x-1/2 backdrop-blur-xl transition-all duration-300 ' +
        (scrolled
          ? 'top-0 w-full rounded-none border-x-0 border-t-0 border-b border-white/10 bg-slate-950/85 shadow-lg shadow-black/20'
          : 'top-3 w-[min(96%,1100px)] rounded-2xl border border-white/10 bg-slate-950/60')
      }
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="mx-auto flex w-[min(96%,1100px)] items-center justify-between gap-3 px-4 py-2">
        <Link aria-label="JustBill home" className="flex items-center gap-2" href="/">
          <Logo size={28} />
        </Link>
        <HeaderNav data={data} />
        <div className="flex items-center gap-2">
          <a className="hidden text-xs font-medium text-slate-300 transition hover:text-white sm:inline" href={`${APP_URL}/login`}>
            Sign in
          </a>
          <a
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#4733ad] shadow-sm transition hover:bg-violet-100"
            href={`${APP_URL}/register`}
          >
            Start free
          </a>
        </div>
      </div>
    </header>
  )
}

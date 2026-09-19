import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  /** `mark` = glyph tile only, `lockup` = glyph + wordmark (default). */
  variant?: 'mark' | 'lockup'
  size?: number
}

/**
 * JustBill brand mark — violet gradient tile with a white ₹ glyph, plus the
 * "justbill." wordmark. Mirrors frontend/src/components/ui/JbLogo.tsx on the
 * main product so the CMS-driven site reads as the same brand.
 */
export const Logo = ({ className, variant = 'lockup', size = 32 }: Props) => {
  return (
    <span className={clsx('inline-flex items-center gap-2.5', className)}>
      <svg aria-hidden={variant === 'lockup'} className="shrink-0" height={size} viewBox="0 0 64 64" width={size}>
        {variant === 'mark' && <title>JustBill</title>}
        <defs>
          <linearGradient id="jb-cms-logo-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#a78bff" />
            <stop offset="1" stopColor="#4733ad" />
          </linearGradient>
        </defs>
        <rect fill="url(#jb-cms-logo-grad)" height="56" rx="14" width="56" x="4" y="4" />
        <text
          fill="white"
          fontFamily="Sora, ui-sans-serif, system-ui"
          fontSize="36"
          fontWeight="800"
          textAnchor="middle"
          x="32"
          y="46"
        >
          ₹
        </text>
      </svg>
      {variant === 'lockup' && (
        <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
          justbill<span className="text-accent">.</span>
        </span>
      )}
    </span>
  )
}

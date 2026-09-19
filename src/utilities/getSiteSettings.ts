import type { SiteSetting } from '@/payload-types'

import { getCachedGlobal } from './getGlobals'

/** Values used before anyone has saved the Site settings global. */
export const SITE_DEFAULTS: SiteSetting = {
  id: 0,
  siteName: 'JustBill',
  defaultTitle: 'GST Billing & Accounting Software for India | JustBill',
  defaultDescription:
    'Create GST invoices, e-invoices and e-way bills, track stock and payments, and get GSTR-ready reports. Start free with JustBill, no credit card needed.',
  blogDescription:
    'Practical guides on GST invoicing, e-invoicing, e-way bills, GST returns and running the accounts of a small Indian business.',
}

/** Cached, revalidated on save. Never throws: a missing DB row falls back to defaults. */
export async function getSiteSettings(): Promise<SiteSetting> {
  try {
    const settings = await getCachedGlobal('site-settings', 1)()
    return {
      ...SITE_DEFAULTS,
      ...settings,
      siteName: settings?.siteName || SITE_DEFAULTS.siteName,
      defaultTitle: settings?.defaultTitle || SITE_DEFAULTS.defaultTitle,
      defaultDescription: settings?.defaultDescription || SITE_DEFAULTS.defaultDescription,
      blogDescription: settings?.blogDescription || SITE_DEFAULTS.blogDescription,
    }
  } catch {
    return SITE_DEFAULTS
  }
}

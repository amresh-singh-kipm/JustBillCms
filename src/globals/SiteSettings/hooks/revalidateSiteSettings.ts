import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

/** Site settings feed the root layout (metadata + JSON-LD), so every page changes. */
export const revalidateSiteSettings: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating site settings')
    revalidateTag('global_site-settings', 'max')
    revalidatePath('/', 'layout')
  }
  return doc
}

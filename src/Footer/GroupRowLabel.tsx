'use client'
import { Footer } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const GroupRowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Footer['groups']>[number]>()

  const label = data?.data?.title
    ? `Column ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.title}`
    : 'Column'

  return <div>{label}</div>
}

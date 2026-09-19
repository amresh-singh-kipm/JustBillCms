import React from 'react'

/** Renders one or more schema.org objects as <script type="application/ld+json">. */
export const JsonLd: React.FC<{ data: object | object[] }> = ({ data }) => {
  const blocks = Array.isArray(data) ? data : [data]
  return (
    <>
      {blocks.map((b, i) => (
        <script
          key={i}
          type="application/ld+json"
          // `<` is escaped so editor content can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(b).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  )
}

/**
 * Flattens a Lexical editor state to plain text, for JSON-LD, RSS summaries
 * and word counts. Block-level nodes become newlines; inline formatting is dropped.
 */
type LexicalNode = {
  type?: string
  text?: string
  children?: LexicalNode[]
  [key: string]: unknown
}

const BLOCK_TYPES = new Set(['paragraph', 'heading', 'listitem', 'quote', 'horizontalrule'])

function walk(node: LexicalNode | undefined, out: string[]): void {
  if (!node) return
  if (typeof node.text === 'string') out.push(node.text)
  if (node.type === 'linebreak') out.push('\n')
  for (const child of node.children ?? []) walk(child, out)
  if (node.type && BLOCK_TYPES.has(node.type)) out.push('\n')
}

export function lexicalToPlainText(state: unknown): string {
  const root = (state as { root?: LexicalNode } | null | undefined)?.root
  if (!root) return ''
  const out: string[] = []
  walk(root, out)
  return out
    .join('')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function wordCount(state: unknown): number {
  const text = lexicalToPlainText(state)
  return text ? text.split(/\s+/).filter(Boolean).length : 0
}

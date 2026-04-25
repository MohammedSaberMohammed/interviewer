import type { MDXComponents } from 'mdx/types'
import { CodeBlock } from '@/components/lesson/CodeBlock'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    pre: CodeBlock as MDXComponents['pre'],
    ...components,
  }
}

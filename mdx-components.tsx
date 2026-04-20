import type { MDXComponents } from 'mdx/types'
import { MdxPre } from '@/components/lesson/CodeBlock'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Route all <pre> blocks through the Shiki-powered server component
    pre: MdxPre as MDXComponents['pre'],
    ...components,
  }
}

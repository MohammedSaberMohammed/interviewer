import type { NextConfig } from 'next'

// next-mdx-remote/rsc compiles MDX at request time (Server Components),
// so no build-time MDX bundling or Turbopack serialization issues.
const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx'],
}

export default nextConfig

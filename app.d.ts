/* eslint-disable import/no-duplicates */

/// <reference types="@stefanprobst/next-svg/types" />

type DeepNonNullable<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}

type KeysAllowUndefined<T> = {
  [K in keyof T]: T[K] | undefined
}

type Nullable<T> = {
  [K in keyof T]?: T[K] | null | undefined
}

type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? Array<Mutable<U>> : Mutable<T[P]>
}

type RemoveIndexSignature<T> = {
  [Key in keyof T as string extends Key ? never : Key]: T[Key]
}

type RequiredKeysAllowUndefined<T> = {
  [K in keyof T]: undefined extends T[K] ? T[K] : T[K] | undefined
}

type UndefinedLeaves<T> = {
  [K in keyof T]: undefined extends T[K]
    ? never
    : T[K] extends Array<unknown>
      ? []
      : T[K] extends object
        ? UndefinedLeaves<T[K]>
        : undefined
}

declare module '*.mdx' {
  import type { MDXContent } from 'mdx/types'

  const content: MDXContent
  const metadata: { title: string }

  export default content
  export { metadata }
}

/**
 * Only necessary because TypeScript currently cannot resolve package exports from `@stefanprobst/next-svg/types`.
 */
declare module '*.svg?symbol-icon' {
  import type { ReactNode, SVGProps, VFC } from 'react'

  const Image: VFC<SVGProps<SVGSVGElement> & { title?: ReactNode }>

  export default Image
}

/**
 * Only necessary because TypeScript currently cannot resolve package exports from `@stefanprobst/next-svg/types`.
 */
declare module '*.svg?symbol-icon' {
  import type { ReactNode, SVGProps, VFC } from 'react'

  const Image: VFC<SVGProps<SVGSVGElement> & { title?: ReactNode }>

  export default Image
}

/**
 * Only necessary because TypeScript currently cannot resolve package exports from `@stefanprobst/next-svg/types`.
 */
declare module '*.svg?inline' {
  import type { ReactNode, SVGProps, VFC } from 'react'

  const Image: VFC<SVGProps<SVGSVGElement> & { title?: ReactNode }>

  export default Image
}

/**
 * Only necessary because TypeScript currently cannot resolve package exports from `@stefanprobst/next-svg/types`.
 */
declare module '*.svg?inline-icon' {
  import type { ReactNode, SVGProps, VFC } from 'react'

  const Image: VFC<SVGProps<SVGSVGElement> & { title?: ReactNode }>

  export default Image
}

/**
 * Only necessary because TypeScript currently cannot resolve package exports from `@stefanprobst/next-svg/types`.
 */
declare module '*.svg' {
  const content: StaticImageData

  export default content
}

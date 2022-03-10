export const curationFlags = ['coverage', 'description', 'merged', 'relations', 'url'] as const

export type CurationFlag = typeof curationFlags[number]

export function isCurationFlag(value: string): value is CurationFlag {
  return curationFlags.includes(value as CurationFlag)
}

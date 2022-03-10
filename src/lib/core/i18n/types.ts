import type { Dictionary } from '@/dictionaries'

export interface WithDictionaries<K extends keyof Dictionary = never> {
  dictionaries: Pick<Dictionary, K>
}

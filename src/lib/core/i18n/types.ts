import type { Dictionary } from '@/messages'

export interface WithDictionaries<K extends keyof Dictionary = never> {
  messages: Pick<Dictionary, K>
}

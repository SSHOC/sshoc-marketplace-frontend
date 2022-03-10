export const entries = Object.entries as <T extends object>(
  obj: T,
) => Array<{ [K in keyof T]: [K, T[K]] }[keyof T]>

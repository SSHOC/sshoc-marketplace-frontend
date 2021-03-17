/**
 * Log message to console.
 */
const log = {
  info(message: string): void {
    console.info('ℹ️', message)
  },
  success(message: string): void {
    console.info('✅', message)
  },
  warn(message: string): void {
    console.warn('⚠️', message)
  },
  error(message: string): void {
    console.error('⛔', message)
  },
}

export { log }

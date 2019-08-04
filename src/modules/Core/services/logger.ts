export const logger = {
  info: (message: string) => console.log(`[info] ${message}`),
  warning: (message: string) => console.warn(`[warning] ${message}`),
  error: (message: string) => console.error(`[error] ${message}`),
}

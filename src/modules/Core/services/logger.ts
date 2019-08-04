const prettyPrint = (data: Object) => JSON.stringify(data, null, 2)

export const logger = {
  info: (message: string) => console.log(`[info] ${message}`),
  warning: (message: string) => console.warn(`[warning] ${message}`),
  error: (message: string) => console.error(`[error] ${message}`),
  apolloError: (message: string, data: Object) =>
    console.log(`[apollo server error] ${message}`, prettyPrint(data)),
  apolloValidationError: (message: string, data: Object) =>
    console.log(`[apollo validation error] ${message}`, prettyPrint(data)),
}

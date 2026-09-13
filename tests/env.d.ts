declare module 'cloudflare:test' {
  interface ProvidedEnv {
    DB: D1Database
    ALLOW_PUBLIC_SIGNUP?: string
  }
}

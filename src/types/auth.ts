export type LoginPageProps = { searchParams: Promise<{ error?: string; returnTo?: string }> }
export type AuthCallbackError = { message: string; code: string }

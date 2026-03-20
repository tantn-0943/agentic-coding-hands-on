import type { LocaleCode } from '@/types/locale'

export interface Messages {
  // Header nav
  nav_about: string
  nav_awards: string
  nav_kudos: string

  // Login page
  login_hero_line1: string
  login_hero_line2: string
  login_button: string
  login_button_loading: string

  // Footer
  footer_copyright: string

  // Common
  go_to_homepage: string
}

const vi: Messages = {
  nav_about: 'About SAA 2025',
  nav_awards: 'Awards Information',
  nav_kudos: 'Sun* Kudos',

  login_hero_line1: 'Bắt đầu hành trình của bạn cùng SAA 2025.',
  login_hero_line2: 'Đăng nhập để khám phá!',
  login_button: 'ĐĂNG NHẬP với Google',
  login_button_loading: 'Đang đăng nhập…',

  footer_copyright: 'Bản quyền thuộc về Sun* © 2025',

  go_to_homepage: 'Về trang chủ',
}

const en: Messages = {
  nav_about: 'About SAA 2025',
  nav_awards: 'Awards Information',
  nav_kudos: 'Sun* Kudos',

  login_hero_line1: 'Start your journey with SAA 2025.',
  login_hero_line2: 'Log in to explore!',
  login_button: 'LOGIN With Google',
  login_button_loading: 'Signing in…',

  footer_copyright: 'Copyright © Sun* 2025',

  go_to_homepage: 'Go to homepage',
}

const messages: Record<LocaleCode, Messages> = { vi, en }

export function getMessages(locale: LocaleCode): Messages {
  return messages[locale]
}

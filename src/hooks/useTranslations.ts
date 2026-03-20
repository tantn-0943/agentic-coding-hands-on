'use client'

import { useMemo } from 'react'
import { useLocale } from '@/hooks/useLocale'
import { getMessages } from '@/lib/i18n/messages'
import type { Messages } from '@/lib/i18n/messages'

export function useTranslations(): Messages {
  const { locale } = useLocale()
  return useMemo(() => getMessages(locale), [locale])
}

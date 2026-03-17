'use client'

import { useCallback, useState } from 'react'

interface UseToastReturn {
  message: string
  visible: boolean
  showToast: (msg: string) => void
  hideToast: () => void
}

export function useToast(): UseToastReturn {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)

  const showToast = useCallback((msg: string) => {
    setMessage(msg)
    setVisible(true)
  }, [])

  const hideToast = useCallback(() => {
    setVisible(false)
  }, [])

  return { message, visible, showToast, hideToast }
}

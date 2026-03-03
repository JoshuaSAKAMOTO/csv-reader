import { useState, useCallback, useRef } from 'react'
import { writeText } from '@tauri-apps/plugin-clipboard-manager'

interface UseClipboardCopyReturn {
  copyRows: (headers: string[], rows: string[][]) => Promise<void>
  copied: boolean
}

export function useClipboardCopyTauri(): UseClipboardCopyReturn {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const copyRows = useCallback(
    async (headers: string[], rows: string[][]) => {
      const tsv = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join(
        '\n',
      )
      await writeText(tsv)
      setCopied(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    },
    [],
  )

  return { copyRows, copied }
}

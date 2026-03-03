import { useState, useCallback } from 'react'
import { open } from '@tauri-apps/plugin-dialog'
import { readFile } from '@tauri-apps/plugin-fs'
import { decodeBuffer, parseCSV } from '../shared/csvProcessing'
import type { CsvData } from '../../types/csv'

interface UseFileLoaderReturn {
  loadFile: () => void
  handleDrop: (e: React.DragEvent) => void
  data: CsvData | null
  isLoading: boolean
  error: string | null
  reset: () => void
}

export function useFileLoaderTauri(): UseFileLoaderReturn {
  const [data, setData] = useState<CsvData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processBuffer = useCallback(
    (buffer: ArrayBuffer, fileName: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const text = decodeBuffer(buffer)
        const csvData = parseCSV(text, fileName)
        setData(csvData)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const loadFile = useCallback(() => {
    ;(async () => {
      try {
        const selected = await open({
          multiple: false,
          filters: [
            {
              name: 'CSV Files',
              extensions: ['csv', 'tsv', 'txt'],
            },
          ],
        })
        if (!selected) return
        const filePath = selected as string
        const fileName = filePath.split(/[\\/]/).pop() ?? filePath
        const bytes = await readFile(filePath)
        processBuffer(bytes.buffer as ArrayBuffer, fileName)
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      }
    })()
  }, [processBuffer])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (!file) return
      ;(async () => {
        setIsLoading(true)
        setError(null)
        try {
          const buffer = await file.arrayBuffer()
          const text = decodeBuffer(buffer)
          const csvData = parseCSV(text, file.name)
          setData(csvData)
        } catch (e) {
          setError(e instanceof Error ? e.message : String(e))
        } finally {
          setIsLoading(false)
        }
      })()
    },
    [],
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return { loadFile, handleDrop, data, isLoading, error, reset }
}

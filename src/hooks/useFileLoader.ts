import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import Encoding from 'encoding-japanese'
import type { CsvData } from '../types/csv'

interface UseFileLoaderReturn {
  loadFile: () => void
  handleDrop: (e: React.DragEvent) => void
  data: CsvData | null
  isLoading: boolean
  error: string | null
  reset: () => void
}

function decodeBuffer(buffer: ArrayBuffer): string {
  const uint8 = new Uint8Array(buffer)
  const detected = Encoding.detect(uint8 as unknown as number[])
  if (detected && detected !== 'UTF8' && detected !== 'ASCII') {
    const converted = Encoding.convert(uint8 as unknown as number[], {
      to: 'UNICODE',
      from: detected as string,
      type: 'string',
    })
    return converted as string
  }
  return new TextDecoder('utf-8').decode(buffer)
}

function parseCSV(text: string, fileName: string): CsvData {
  const result = Papa.parse<string[]>(text, {
    header: false,
    skipEmptyLines: true,
  })
  const rows = result.data
  if (rows.length === 0) {
    return { headers: [], rows: [], fileName }
  }
  const headers = rows[0]
  return { headers, rows: rows.slice(1), fileName }
}

async function processFile(file: File): Promise<CsvData> {
  const buffer = await file.arrayBuffer()
  const text = decodeBuffer(buffer)
  return parseCSV(text, file.name)
}

export function useFileLoader(): UseFileLoaderReturn {
  const [data, setData] = useState<CsvData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)
    try {
      const csvData = await processFile(file)
      setData(csvData)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadFile = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv,.tsv,.txt'
    input.onchange = () => {
      const file = input.files?.[0]
      if (file) handleFile(file)
    }
    input.click()
  }, [handleFile])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
  }, [])

  return { loadFile, handleDrop, data, isLoading, error, reset }
}

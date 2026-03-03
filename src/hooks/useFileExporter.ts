import { useCallback } from 'react'
import Papa from 'papaparse'

interface UseFileExporterReturn {
  exportCsv: (data: string[][], headers: string[], fileName: string) => void
}

export function useFileExporter(): UseFileExporterReturn {
  const exportCsv = useCallback(
    (data: string[][], headers: string[], fileName: string) => {
      const csvString = Papa.unparse({
        fields: headers,
        data,
      })
      const bom = '\uFEFF'
      const blob = new Blob([bom + csvString], {
        type: 'text/csv;charset=utf-8',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
    [],
  )

  return { exportCsv }
}

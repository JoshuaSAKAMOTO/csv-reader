import { useCallback } from 'react'
import Papa from 'papaparse'
import { save } from '@tauri-apps/plugin-dialog'
import { writeFile } from '@tauri-apps/plugin-fs'

interface UseFileExporterReturn {
  exportCsv: (data: string[][], headers: string[], fileName: string) => void
}

export function useFileExporterTauri(): UseFileExporterReturn {
  const exportCsv = useCallback(
    (data: string[][], headers: string[], fileName: string) => {
      ;(async () => {
        try {
          const filePath = await save({
            defaultPath: fileName,
            filters: [
              {
                name: 'CSV Files',
                extensions: ['csv'],
              },
            ],
          })
          if (!filePath) return

          const csvString = Papa.unparse({
            fields: headers,
            data,
          })

          const bom = new Uint8Array([0xef, 0xbb, 0xbf])
          const csvBytes = new TextEncoder().encode(csvString)
          const combined = new Uint8Array(bom.length + csvBytes.length)
          combined.set(bom)
          combined.set(csvBytes, bom.length)

          await writeFile(filePath, combined)
        } catch (e) {
          console.error('Export failed:', e)
        }
      })()
    },
    [],
  )

  return { exportCsv }
}

import Papa from 'papaparse'
import Encoding from 'encoding-japanese'
import type { CsvData } from '../../types/csv'

export function decodeBuffer(buffer: ArrayBuffer): string {
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

export function parseCSV(text: string, fileName: string): CsvData {
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

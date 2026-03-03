export type CsvRow = string[]

export interface CsvData {
  headers: string[]
  rows: CsvRow[]
  fileName: string
}

export type CellKey = `${number}-${number}`

export type EditedCellsMap = Map<CellKey, string>

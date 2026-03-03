import { useState, useCallback } from 'react'
import type {
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from '@tanstack/react-table'
import { useFileLoader, useFileExporter, useClipboardCopy } from './hooks'
import { FileUploader } from './components/FileUploader'
import { Toolbar } from './components/Toolbar'
import { DataTable } from './components/DataTable'
import { StatusBar } from './components/StatusBar'
import { PrivacyNotice } from './components/PrivacyNotice'
import { InstallPrompt } from './components/InstallPrompt'
import type { CellKey, EditedCellsMap } from './types/csv'

function App() {
  const { loadFile, handleDrop, data, isLoading, error, reset } =
    useFileLoader()
  const { exportCsv } = useFileExporter()
  const { copyRows, copied } = useClipboardCopy()

  const [editedCells, setEditedCells] = useState<EditedCellsMap>(new Map())
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [filteredRowCount, setFilteredRowCount] = useState(0)

  const handleCellEdit = useCallback((key: CellKey, value: string) => {
    setEditedCells((prev) => {
      const next = new Map(prev)
      next.set(key, value)
      return next
    })
  }, [])

  const getMergedRows = useCallback(
    (rows: string[][]) => {
      return rows.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          const key: CellKey = `${rowIdx}-${colIdx}`
          return editedCells.get(key) ?? cell
        }),
      )
    },
    [editedCells],
  )

  const handleExportAll = useCallback(() => {
    if (!data) return
    const merged = getMergedRows(data.rows)
    const baseName = data.fileName.replace(/\.[^.]+$/, '')
    exportCsv(merged, data.headers, `${baseName}_export.csv`)
  }, [data, getMergedRows, exportCsv])

  const handleExportFiltered = useCallback(() => {
    if (!data) return
    const merged = getMergedRows(data.rows)
    const baseName = data.fileName.replace(/\.[^.]+$/, '')
    exportCsv(merged, data.headers, `${baseName}_filtered.csv`)
  }, [data, getMergedRows, exportCsv])

  const handleCopy = useCallback(() => {
    if (!data) return
    const selectedIndices = Object.keys(rowSelection)
      .filter((k) => rowSelection[k])
      .map(Number)
    if (selectedIndices.length === 0) return
    const merged = getMergedRows(data.rows)
    const selectedRows = selectedIndices.map((i) => merged[i]).filter(Boolean)
    copyRows(data.headers, selectedRows)
  }, [data, rowSelection, getMergedRows, copyRows])

  const handleClearFilter = useCallback(() => {
    setColumnFilters([])
  }, [])

  const handleReset = useCallback(() => {
    reset()
    setEditedCells(new Map())
    setSorting([])
    setColumnFilters([])
    setRowSelection({})
    setFilteredRowCount(0)
  }, [reset])

  const hasFilter = columnFilters.length > 0
  const hasSelection = Object.values(rowSelection).some(Boolean)

  return (
    <div className="flex flex-col h-screen bg-white">
      {!data ? (
        <FileUploader
          onDrop={handleDrop}
          onSelectFile={loadFile}
          isLoading={isLoading}
          error={error}
        />
      ) : (
        <>
          <Toolbar
            onExportAll={handleExportAll}
            onExportFiltered={handleExportFiltered}
            onCopy={handleCopy}
            onClearFilter={handleClearFilter}
            hasFilter={hasFilter}
            copied={copied}
            hasSelection={hasSelection}
            fileName={data.fileName}
            onReset={handleReset}
          />
          <DataTable
            headers={data.headers}
            rows={data.rows}
            editedCells={editedCells}
            onCellEdit={handleCellEdit}
            sorting={sorting}
            onSortingChange={setSorting}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            onFilteredRowCountChange={setFilteredRowCount}
          />
          <StatusBar
            totalRows={data.rows.length}
            filteredRows={filteredRowCount}
            selectedRows={
              Object.values(rowSelection).filter(Boolean).length
            }
          />
        </>
      )}
      <PrivacyNotice />
      <InstallPrompt />
    </div>
  )
}

export default App

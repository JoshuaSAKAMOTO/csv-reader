import { useMemo, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
  type FilterFn,
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { TableHeader } from './table/TableHeader'
import { FilterRow } from './table/FilterRow'
import { TableBody } from './table/TableBody'
import { EditableCell } from './table/EditableCell'
import type { CellKey, EditedCellsMap } from '../types/csv'

interface DataTableProps {
  headers: string[]
  rows: string[][]
  editedCells: EditedCellsMap
  onCellEdit: (key: CellKey, value: string) => void
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  columnFilters: ColumnFiltersState
  onColumnFiltersChange: (filters: ColumnFiltersState) => void
  rowSelection: RowSelectionState
  onRowSelectionChange: (selection: RowSelectionState) => void
  onFilteredRowCountChange: (count: number) => void
}

const caseInsensitiveFilter: FilterFn<string[]> = (
  row,
  columnId,
  filterValue,
) => {
  const value = row.getValue<string>(columnId)
  return value.toLowerCase().includes((filterValue as string).toLowerCase())
}

export function DataTable({
  headers,
  rows,
  editedCells,
  onCellEdit,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  rowSelection,
  onRowSelectionChange,
  onFilteredRowCountChange,
}: DataTableProps) {
  const { t } = useTranslation()
  const columnHelper = createColumnHelper<string[]>()

  const columns = useMemo(() => {
    const selectCol = columnHelper.display({
      id: 'select',
      size: 40,
      header: ({ table }) => (
        <div className="px-2 py-1 flex items-center justify-center">
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            aria-label={t('table.selectAll')}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-2 py-1 flex items-center justify-center">
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    })

    const rowNumCol = columnHelper.display({
      id: 'rowNumber',
      size: 60,
      header: () => (
        <span className="text-gray-500">{t('table.rowNumber')}</span>
      ),
      cell: ({ row }) => (
        <div className="px-2 py-1 text-sm text-gray-400 text-right">
          {row.index + 1}
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    })

    const dataCols = headers.map((header, colIndex) =>
      columnHelper.accessor((row) => row[colIndex] ?? '', {
        id: `col_${colIndex}`,
        header: () => header,
        size: Math.max(120, Math.min(300, header.length * 12 + 40)),
        cell: ({ row, getValue }) => {
          const rowIndex = rows.indexOf(row.original)
          const cellKey: CellKey = `${rowIndex}-${colIndex}`
          const editedValue = editedCells.get(cellKey)
          const displayValue = editedValue ?? getValue()

          return (
            <EditableCell
              value={displayValue}
              isEdited={editedCells.has(cellKey)}
              onSave={(val) => onCellEdit(cellKey, val)}
            />
          )
        },
        filterFn: caseInsensitiveFilter,
      }),
    )

    return [selectCol, rowNumCol, ...dataCols]
  }, [headers, rows, editedCells, onCellEdit, columnHelper, t])

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(sorting) : updater
      onSortingChange(next)
    },
    onColumnFiltersChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(columnFilters) : updater
      onColumnFiltersChange(next)
    },
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater(rowSelection) : updater
      onRowSelectionChange(next)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  })

  const filteredRowCount = table.getFilteredRowModel().rows.length

  const prevFilteredCountRef = useMemo(() => {
    onFilteredRowCountChange(filteredRowCount)
    return filteredRowCount
  }, [filteredRowCount, onFilteredRowCountChange])
  void prevFilteredCountRef

  const headerGroup = table.getHeaderGroups()[0]
  const filteredRows = table.getRowModel().rows
  const totalColumnWidth = headerGroup.headers.reduce(
    (sum, h) => sum + h.getSize(),
    0,
  )

  const getScrollContainerWidth = useCallback(() => {
    return `${totalColumnWidth}px`
  }, [totalColumnWidth])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="overflow-x-auto flex-1 flex flex-col">
        <div style={{ minWidth: getScrollContainerWidth() }}>
          <div className="sticky top-0 z-10">
            <TableHeader headers={headerGroup.headers} />
            <FilterRow headers={headerGroup.headers} />
          </div>
        </div>
        <TableBody
          rows={filteredRows}
          totalColumnWidth={totalColumnWidth}
        />
      </div>
    </div>
  )
}

import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { flexRender } from '@tanstack/react-table'
import type { Row, RowData } from '@tanstack/react-table'

interface TableBodyProps<T extends RowData> {
  rows: Row<T>[]
  totalColumnWidth: number
}

export function TableBody<T extends RowData>({
  rows,
  totalColumnWidth,
}: TableBodyProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 10,
  })

  return (
    <div ref={parentRef} className="flex-1 overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: `${totalColumnWidth}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index]
          return (
            <div
              key={row.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className={`flex border-b border-gray-100 ${
                row.getIsSelected()
                  ? 'bg-blue-50'
                  : virtualRow.index % 2 === 0
                    ? 'bg-white'
                    : 'bg-gray-50/50'
              } hover:bg-blue-50/50`}
            >
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                  className="flex-shrink-0 overflow-hidden"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

import type { Header, RowData } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'

interface TableHeaderProps<T extends RowData> {
  headers: Header<T, unknown>[]
}

export function TableHeader<T extends RowData>({
  headers,
}: TableHeaderProps<T>) {
  return (
    <div className="flex bg-gray-100 border-b border-gray-300 font-medium text-sm text-gray-700">
      {headers.map((header) => (
        <div
          key={header.id}
          style={{ width: header.getSize() }}
          className="flex-shrink-0"
        >
          {header.isPlaceholder ? null : (
            <div
              className={`px-2 py-2 select-none ${header.column.getCanSort() ? 'cursor-pointer hover:bg-gray-200' : ''}`}
              onClick={header.column.getToggleSortingHandler()}
            >
              <div className="flex items-center gap-1">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                {header.column.getCanSort() && (
                  <span className="text-xs">
                    {header.column.getIsSorted() === 'asc'
                      ? '▲'
                      : header.column.getIsSorted() === 'desc'
                        ? '▼'
                        : '△'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

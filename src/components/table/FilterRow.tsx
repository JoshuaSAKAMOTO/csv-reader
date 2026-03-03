import { useState, useEffect, useRef } from 'react'
import type { Header, RowData } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

interface FilterRowProps<T extends RowData> {
  headers: Header<T, unknown>[]
}

function DebouncedInput({
  value: initialValue,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  const [value, setValue] = useState(initialValue)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onChange(value)
    }, 300)
    return () => clearTimeout(timerRef.current)
  }, [value, onChange])

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full px-2 py-1 text-sm border border-gray-200 rounded outline-none focus:border-blue-400"
    />
  )
}

export function FilterRow<T extends RowData>({
  headers,
}: FilterRowProps<T>) {
  const { t } = useTranslation()

  return (
    <div className="flex bg-white border-b border-gray-200">
      {headers.map((header) => (
        <div
          key={header.id}
          style={{ width: header.getSize() }}
          className="flex-shrink-0 px-1 py-1"
        >
          {header.column.getCanFilter() ? (
            <DebouncedInput
              value={(header.column.getFilterValue() as string) ?? ''}
              onChange={(value) => header.column.setFilterValue(value)}
              placeholder={t('table.filterPlaceholder')}
            />
          ) : null}
        </div>
      ))}
    </div>
  )
}

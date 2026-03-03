import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface ExportButtonProps {
  onExportAll: () => void
  onExportFiltered: () => void
  hasFilter: boolean
}

export function ExportButton({
  onExportAll,
  onExportFiltered,
  hasFilter,
}: ExportButtonProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = (filtered: boolean) => {
    if (filtered) {
      onExportFiltered()
    } else {
      onExportAll()
    }
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => (hasFilter ? setOpen(!open) : handleExport(false))}
        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label={t('toolbar.export')}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        {t('toolbar.export')}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]">
          <button
            onClick={() => handleExport(false)}
            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
          >
            {t('toolbar.exportAll')}
          </button>
          <button
            onClick={() => handleExport(true)}
            className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
          >
            {t('toolbar.exportFiltered')}
          </button>
        </div>
      )}
    </div>
  )
}

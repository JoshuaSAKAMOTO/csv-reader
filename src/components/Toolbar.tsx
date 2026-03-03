import { ExportButton } from './ExportButton'
import { CopyButton } from './CopyButton'
import { ClearFilterButton } from './ClearFilterButton'
import { LanguageSwitcher } from './LanguageSwitcher'

interface ToolbarProps {
  onExportAll: () => void
  onExportFiltered: () => void
  onCopy: () => void
  onClearFilter: () => void
  hasFilter: boolean
  copied: boolean
  hasSelection: boolean
  fileName: string
  onReset: () => void
}

export function Toolbar({
  onExportAll,
  onExportFiltered,
  onCopy,
  onClearFilter,
  hasFilter,
  copied,
  hasSelection,
  fileName,
  onReset,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-white border-b border-gray-200">
      <span className="text-sm font-medium text-gray-700 mr-auto">
        {fileName}
      </span>
      <button
        onClick={onReset}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
      <ClearFilterButton onClick={onClearFilter} disabled={!hasFilter} />
      <CopyButton onClick={onCopy} copied={copied} disabled={!hasSelection} />
      <ExportButton
        onExportAll={onExportAll}
        onExportFiltered={onExportFiltered}
        hasFilter={hasFilter}
      />
      <LanguageSwitcher />
    </div>
  )
}

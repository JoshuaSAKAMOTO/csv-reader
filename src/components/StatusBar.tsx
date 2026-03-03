import { useTranslation } from 'react-i18next'

interface StatusBarProps {
  totalRows: number
  filteredRows: number
  selectedRows: number
}

export function StatusBar({
  totalRows,
  filteredRows,
  selectedRows,
}: StatusBarProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-4 px-4 py-2 text-sm text-gray-600 bg-gray-50 border-t border-gray-200">
      <span>{t('statusBar.totalRows', { count: totalRows })}</span>
      {filteredRows !== totalRows && (
        <span>{t('statusBar.filteredRows', { count: filteredRows })}</span>
      )}
      {selectedRows > 0 && (
        <span>{t('statusBar.selectedRows', { count: selectedRows })}</span>
      )}
    </div>
  )
}

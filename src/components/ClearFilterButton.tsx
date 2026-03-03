import { useTranslation } from 'react-i18next'

interface ClearFilterButtonProps {
  onClick: () => void
  disabled: boolean
}

export function ClearFilterButton({
  onClick,
  disabled,
}: ClearFilterButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={t('toolbar.clearFilter')}
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
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
      {t('toolbar.clearFilter')}
    </button>
  )
}

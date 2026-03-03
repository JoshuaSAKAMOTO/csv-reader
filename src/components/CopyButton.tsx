import { useTranslation } from 'react-i18next'

interface CopyButtonProps {
  onClick: () => void
  copied: boolean
  disabled: boolean
}

export function CopyButton({ onClick, copied, disabled }: CopyButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={t('toolbar.copy')}
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
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      {copied ? t('toolbar.copied') : t('toolbar.copy')}
    </button>
  )
}

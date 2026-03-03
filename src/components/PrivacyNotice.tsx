import { useTranslation } from 'react-i18next'

export function PrivacyNotice() {
  const { t } = useTranslation()

  return (
    <div className="px-4 py-2 text-xs text-center text-gray-400 bg-gray-50 border-t border-gray-100">
      {t('privacy.notice')}
    </div>
  )
}

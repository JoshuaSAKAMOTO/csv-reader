import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const toggleLanguage = () => {
    const next = i18n.language.startsWith('ja') ? 'en' : 'ja'
    i18n.changeLanguage(next)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Switch language"
    >
      {t('language.switch')}
    </button>
  )
}

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'

interface FileUploaderProps {
  onDrop: (e: React.DragEvent) => void
  onSelectFile: () => void
  isLoading: boolean
  error: string | null
}

export function FileUploader({
  onDrop,
  onSelectFile,
  isLoading,
  error,
}: FileUploaderProps) {
  const { t } = useTranslation()
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      setIsDragOver(false)
      onDrop(e)
    },
    [onDrop],
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full max-w-lg p-12 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={onSelectFile}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelectFile()
        }}
        aria-label={t('fileUploader.selectFile')}
      >
        <svg
          className="w-12 h-12 mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {isLoading ? (
          <p className="text-gray-500">{t('fileUploader.loading')}</p>
        ) : (
          <>
            <p className="mb-2 text-gray-600 text-center">
              {t('fileUploader.dropHere')}
            </p>
            <p className="mb-4 text-sm text-gray-400">
              {t('fileUploader.or')}
            </p>
            <span className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">
              {t('fileUploader.selectFile')}
            </span>
          </>
        )}
      </div>
      {error && (
        <p className="mt-4 text-sm text-red-500">
          {t('fileUploader.error', { message: error })}
        </p>
      )}
    </div>
  )
}

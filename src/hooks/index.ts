import { isTauri } from '../lib/isTauri'
import { useFileLoader as useFileLoaderWeb } from './useFileLoader'
import { useFileExporter as useFileExporterWeb } from './useFileExporter'
import { useClipboardCopy as useClipboardCopyWeb } from './useClipboardCopy'
import { useFileLoaderTauri } from './tauri/useFileLoaderTauri'
import { useFileExporterTauri } from './tauri/useFileExporterTauri'
import { useClipboardCopyTauri } from './tauri/useClipboardCopyTauri'

const _isTauri = isTauri()

export const useFileLoader = _isTauri ? useFileLoaderTauri : useFileLoaderWeb
export const useFileExporter = _isTauri
  ? useFileExporterTauri
  : useFileExporterWeb
export const useClipboardCopy = _isTauri
  ? useClipboardCopyTauri
  : useClipboardCopyWeb

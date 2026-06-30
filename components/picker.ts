// @/components/picker

import { useState, useCallback } from 'react'
import * as DocumentPicker from 'expo-document-picker'
import { useTranslation } from 'react-i18next'
import { hapticTap } from './haptics'
import type { PickerProps } from '@/types'

export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export function Picker ({ docs, setDocs }: PickerProps) {
	const { t } = useTranslation()
	const [isLoading, setIsLoading] = useState(false)

	const pick = useCallback(async () => {
		try {
			setIsLoading(true)
			hapticTap()
			const res = await DocumentPicker.getDocumentAsync({
				type: ['application/msword', DOCX_MIME],
				copyToCacheDirectory: true
			})
			const file = res.assets?.[0]
			if (!res.canceled && file) {
				if (docs.some(d => d.title === file.name)) {
					return false
				}
				const kb = (file.size || 0) / 1024
				const fileSizeFormatted = kb < 102.4
					? `${kb.toFixed(0)} KB`
					: `${(kb / 1024).toFixed(1)} MB`
				setDocs(prev => [{
					id: Date.now().toString(),
					title: file.name, size: fileSizeFormatted,
					date: `${t('today')}, ${new Date().toLocaleTimeString(
						[], { hour: '2-digit', minute: '2-digit' }
					)}`, uri: file.uri
				}, ...prev])
				hapticTap()
			}
		} catch {} finally { setIsLoading(false) }
	}, [docs, setDocs, t])
	return { pick, isLoading }
}
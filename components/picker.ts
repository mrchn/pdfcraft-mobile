// @/components/picker (pdfcraft-mobile)

import { useState, useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { hapticTap } from '@/components';
import type { PickerProps, Doc } from '@/components';

export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export function Picker ({ docs, setDocs }: PickerProps) {

	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);

	const pick = useCallback(async () => {
		try {
			setIsLoading(true);
			hapticTap();
			const res = await DocumentPicker.getDocumentAsync({
				type: ['application/msword', DOCX_MIME],
				copyToCacheDirectory: true
			});
			if (!res.canceled && res.assets && res.assets[0]) {
				const pickedFile = res.assets[0];
				const fileSizeBytes = pickedFile.size;
				const alreadyExists = docs.some(
					d => d.title === pickedFile.name
				);
				if (alreadyExists) {
					Alert.alert(
						':(', t('docExists'), [{ text: 'OK' }]
					);
					return
				}
				let fileSizeFormatted = '0.1 MB';
				if (fileSizeBytes) {
					const sizeInMb = fileSizeBytes / (1024 * 1024);
					fileSizeFormatted = sizeInMb < 0.1
						? `${(fileSizeBytes / 1024).toFixed(0)} KB`
						: `${sizeInMb.toFixed(1)} MB`
				}
				const newDoc: Doc = {
					id: Date.now().toString(),
					title: pickedFile.name,
					size: fileSizeFormatted,
					date: `Today, ${new Date().toLocaleTimeString(
						[], { hour: '2-digit', minute: '2-digit' }
					)}`,
					icon: 'document-text', color: '#1F4E79',
					uri: pickedFile.uri
				};
				hapticTap();
				setDocs(prev => [newDoc, ...prev])
			}
		} catch (error) {
			console.error('Error picking document:', error);
			Alert.alert(t('error'), t('failedToPickDocument'))
		} finally { setIsLoading(false) }
	}, [docs, setDocs, t]);
	return { pick, isLoading }
}
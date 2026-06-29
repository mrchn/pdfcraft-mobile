// @/services/parse

import JSZip from 'jszip'
import { readAsStringAsync } from 'expo-file-system/legacy'

export const Parse = async (uri: string): Promise<string[]> => {
	try {
		const zip = await JSZip.loadAsync(
			await readAsStringAsync(
				uri, { encoding: 'base64' }
			), { base64: true }
		)
		const xml = await zip.file('word/document.xml')
			?.async('text')
		if (!xml) return []
		return [...new Set(
			(
				xml.replace(/<[^>]+>/g, '')
					.match(/\{\{([^\{\}]+?)\}\}/g) || []
			)
				.map(m => m.replace(/[\{\}\s\xa0]/g, ''))
				.filter(Boolean)
		)]
	} catch { return [] }
}
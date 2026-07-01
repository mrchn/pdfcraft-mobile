// @/craft
import JSZip from 'jszip'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system/legacy'
import { printToFileAsync } from 'expo-print'
import { useTranslation } from 'react-i18next'
import { ooxml_to_html } from './ooxml2html'
import type { CreateProps } from '@/types'

const getXML = async (uri: string) => { return (await JSZip.loadAsync(
	await FileSystem.readAsStringAsync(
		uri, { encoding: 'base64' }
	), { base64: true }
)).file('word/document.xml')?.async('text') }

export async function Create({ doc, data, t }: CreateProps) {
	const uriPDF = `${FileSystem.cacheDirectory}${t('crafted')}.pdf`
	try {
		let xml = await getXML(doc.uri)
		if (!xml) return false
		Object.entries(data).forEach(([key, value]) => {
			const tag = '(?:<[^>]+>)*'
			const esc = key.split('')
				.map(c => c.replace(
					/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'
				)).join(tag)
			const safeValue = String(value).replace(/&/g, '&amp;')
				.replace(/</g, '&lt;').replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
			xml = xml!.replace(new RegExp(
				`\\{${tag}\\{${tag}\\s*${tag}${esc}` +
				`\\s*${tag}\\}${tag}\\}`, 'g'
			), () => safeValue)
		})
		await new Promise(r => setTimeout(r, 1000))
		const { uri: tmp } = await printToFileAsync({
			html:
				`<!DOCTYPE html><html><body style="font-family` +
				`:serif;padding:40px;font-size:14px">` +
				`${ooxml_to_html(xml)}</body></html>`
		})
		await FileSystem.moveAsync({ from: tmp, to: uriPDF })
		Sharing.shareAsync(uriPDF, {
			mimeType: 'application/pdf', UTI: 'com.adobe.pdf',
			dialogTitle: `${t('share')}`
		}).finally(() => {
			FileSystem.deleteAsync(
				uriPDF, { idempotent: true }
			).catch(() => {})
		})
		return true
	} catch { return false }
}

export const Parse = async (uri: string): Promise<string[]> => {
	try {
		const xml = await getXML(uri)
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
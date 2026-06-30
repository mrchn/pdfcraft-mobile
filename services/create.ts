// @/services/create

import JSZip from 'jszip'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import { printToFileAsync } from 'expo-print'
import { ooxml_to_html } from './ooxml2html'
import type { CreateProps, TemplateProps } from '@/components'

const fillTemplate = async (temp, title, data): TemplateProps => {
	try {
		const zip = await JSZip.loadAsync(
			await FileSystem.readAsStringAsync(
				temp, { encoding: 'base64' }
				), { base64: true }
			)
		let xml = await zip.file('word/document.xml')?.async('text')
		if (!xml) return null
		Object.entries(data).forEach(([key, value]) => {
			const tag = '(?:<[^>]+>)*'
			const esc_key = key.split('')
				.map(char => char.replace(
					/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'
				)).join(tag)
			xml = xml!.replace(new RegExp(
				`\\{${tag}\\{${tag}\\s*${tag}` +
				`${esc_key}` +
				`\\s*${tag}\\}${tag}\\}`, 'g'
			), () => value)
		})
		zip.file('word/document.xml', xml)
		const uri = FileSystem.documentDirectory + `craft_${title}`
		await FileSystem.writeAsStringAsync(
			uri, await zip.generateAsync({ type: 'base64' }),
			{ encoding: 'base64' }
		)
		return uri
	} catch { return null }
}

async function convert(docx: string, pdf: string): Promise<boolean> {
	try {
		const zip = await JSZip.loadAsync(
			await FileSystem.readAsStringAsync(
				docx, { encoding: 'base64' }
			), { base64: true }
		)
		const xml = await zip
			.file('word/document.xml')
			?.async('text')
		if (!xml) return false
		const { uri: tmp } = await printToFileAsync({
			html:
				`<!DOCTYPE html><html><body style="font-family` +
				`:serif;padding:40px;font-size:14px">` +
				`${ooxml_to_html(xml)}</body></html>`
		})
		await FileSystem.moveAsync({ from: tmp, to: pdf })
		return true
	} catch { return false }
}

export async function Create({ doc, data }: CreateProps) {
	const uri = await fillTemplate(doc.uri, doc.title, data)
	if (!uri) return false
	try {
		const pdf_uri = `${FileSystem.cacheDirectory}craft.pdf`
		await new Promise(resolve => setTimeout(resolve, 600))
		const converted = await convert(uri, pdf_uri)
		if (!converted) return false
		Sharing.shareAsync(pdf_uri)
		await FileSystem.deleteAsync(uri, { idempotent: true })
		return true
	} catch {}
	finally {
		FileSystem.deleteAsync(pdf_uri, { idempotent: true })
	}
}
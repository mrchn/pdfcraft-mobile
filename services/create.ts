// @/services/create

import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import { Generate } from './server'
import { convertPDF } from './convert'
import type { CreateProps } from './interfaces'

export async function Create({ doc, data }: CreateProps) {
	const uri = await Generate(doc.uri, doc.title, data)
	if (!uri) return false
	try {
		const pdf_uri = `${FileSystem.cacheDirectory}craft.pdf`
		await new Promise(resolve => setTimeout(resolve, 600))
		const converted = await convertPDF(uri, pdf_uri)
		if (!converted) return false
		Sharing.shareAsync(pdf_uri)
		await FileSystem.deleteAsync(uri, { idempotent: true })
		return true
	} catch {}
	finally {
		FileSystem.deleteAsync(pdf_uri, { idempotent: true })
	}
}
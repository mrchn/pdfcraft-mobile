// @/services/convert

import * as FileSystem from 'expo-file-system/legacy';
import { printToFileAsync } from 'expo-print';
import mammoth from 'mammoth';

export async function convertPDF(
	docxUri: string, pdfUri: string
): Promise<boolean> {
	try {
		const base64 = await FileSystem.readAsStringAsync(
			docxUri, { encoding: 'base64' }
		);
		const binary = atob(base64);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i)
		}
		const { value: html } = await mammoth.convertToHtml(
			{ arrayBuffer: bytes.buffer }
		);
		const { uri: tmp } = await printToFileAsync({
			html: `<!DOCTYPE html><html><body style="font-family:serif;padding:40px">${html}</body></html>`
		});
		await FileSystem.moveAsync({ from: tmp, to: pdfUri });
		return true
	} catch { return false }
}
// @/services/convert

import * as FileSystem from 'expo-file-system/legacy';
import { printToFileAsync } from 'expo-print';

export async function convertPDF(
	docxUri: string, pdfUri: string
): Promise<boolean> {
	try {
		const zip = await JSZip.loadAsync(
			await FileSystem.readAsStringAsync(
				docxUri, { encoding: 'base64' }
			), { base64: true }
		);
		const xml = await zip
			.file('word/document.xml')
			?.async('text');
		if (!xml) return false;
		const { uri: tmp } = await Print.printToFileAsync({
			html: `<!DOCTYPE html><html><body style="font-family:serif;padding:40px;font-size:14px">${ooxml_to_html(xml)}</body></html>`
		});
		await FileSystem.moveAsync({ from: tmp, to: pdfUri });
		return true
	} catch { return false }
}
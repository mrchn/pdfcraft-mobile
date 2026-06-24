// @/services/server (pdfcraft-mobile)

import JSZip from 'jszip';
import * as FileSystem from 'expo-file-system/legacy';

export const Generate = async (
	temp_uri: string, title: string, data: Record<string, string>
) => {
	try {
		const zip = await JSZip.loadAsync(
			await FileSystem.readAsStringAsync(
				temp_uri, { encoding: 'base64' }
				), { base64: true }
			);
		let xml = await zip.file('word/document.xml')?.async('text');
		if (!xml) return null;
		Object.entries(data).forEach(([key, value]) => {
			const tag = '(?:<[^>]+>)*';
			const esc_key = key.split('')
				.map(char => char.replace(
					/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'
				)).join(tag);
			xml = xml!.replace(new RegExp(
				`\\{${tag}\\{${tag}\\s*${tag}` +
				`${esc_key}` +
				`\\s*${tag}\\}${tag}\\}`, 'g'
			), value)
		});
		zip.file('word/document.xml', xml);
		const uri = FileSystem.documentDirectory + `craft_${title}`;
		await FileSystem.writeAsStringAsync(
			uri, await zip.generateAsync({ type: 'base64' }),
			{ encoding: 'base64' }
		);
		return uri
	} catch { return null }
}
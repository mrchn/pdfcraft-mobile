// @/services/create (pdfcraft-mobile)

import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { DOCX_MIME } from '@/components';
import { Parse, Generate } from './server';

type Params = {
	doc: { uri: string; title: string; };
	data: Record<string, string>;
	url: string; t: (key: string) => string
};

export async function Create({ doc, data, url, t }: Params) {

	const uri = await Generate(doc.uri, doc.title, data);

	if (uri) {
		const docx_title = uri.split('/').pop()
			|| `crafted_${doc.title}`;
		const pdf_title = docx_title.replace('.docx', '.pdf');

		const formData = new FormData();
		formData.append('file', {
			uri: uri, name: docx_title, type: DOCX_MIME
		} as any);

		const res = await fetch(`${url}/convert`, {
			method: 'POST', body: formData,
			headers: { 'Accept': 'application/pdf' }
		});
		const contentType = res.headers.get('content-type');

		if (!res.ok) { // SERVER ERROR
			const errorText = await res.text();
			Alert.alert(
				`${t('serverError')}`, errorText, [{ text: 'OK' }]
			);
			return false
		}

		if ( // если сервер прислал не pdf
			contentType && !contentType.includes('application/pdf')
		) {
			const rawText = await res.text();
			Alert.alert(
				`${t('serverResponse')}`, rawText, [{ text: 'OK' }]
			);
			return false
		}

		const arrayBuffer = await res.arrayBuffer();
		const uint8 = new Uint8Array(arrayBuffer);
		const chunks: string[] = [];
		for (let i = 0; i < uint8.length; i += 1024) {
			chunks.push(
				String.fromCharCode.apply(
					null, uint8.subarray(i, i + 1024)
				)
			)
		}
		const base64_data = btoa(chunks.join(''));
		const pdf_uri = `${FileSystem.documentDirectory}${pdf_title}`;

		await FileSystem.writeAsStringAsync(
			pdf_uri, base64_data,
			{ encoding: FileSystem.EncodingType.Base64 }
		);

		if (await Sharing.isAvailableAsync()) {
			await Sharing.shareAsync(pdf_uri)
		};

		await FileSystem.deleteAsync(uri, { idempotent: true })
		return true

	} else {
		Alert.alert(':(', `${t('craftError')}`, [{ text: 'OK' }]);
		return false
	}
}
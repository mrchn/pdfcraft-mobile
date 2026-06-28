// @/services/create (pdfcraft-mobile)

import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { Generate } from './server';
import { localConvert } from '@/modules/ios-native-convert';

type Params = {
	doc: { uri: string; title: string; };
	data: Record<string, string>;
	t: (key: string) => string
};

export async function Create ({ doc, data, t }: Params) {

	const uri = await Generate(doc.uri, doc.title, data);

	if (uri) {
		const docx_title = uri.split('/').pop()
			|| `crafted_${doc.title}`;
		const pdf_title = docx_title.replace('.docx', '.pdf');
		const pdf_uri = `${FileSystem.documentDirectory}${pdf_title}`;

		const isConvertedLocally = await localConvert(uri, pdf_uri);

		if (!isConvertedLocally) {
			Alert.alert(t('craft'), t('craftError'));
			return false
		}

		await Sharing.shareAsync(pdf_uri);
		await FileSystem.deleteAsync(uri, { idempotent: true });
		return true

	}
	return false
}
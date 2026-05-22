// @/components/pdfcraft (pdfcraft-mobile)
import * as Crypto from 'expo-crypto'; import JSZip from 'jszip';
import * as FileSystem from 'expo-file-system/legacy';

const SECRET_SALT = 'YOUR_SUPER_SECRET_SALT';

// делаем айди договора
export const generate_contract_id = (): string => {
	const year = new Date().getFullYear().toString().slice(-2); const random_bytes = Crypto.getRandomBytes(2);
	const hex_token = Array.from(random_bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
	return `${year}${hex_token}`;
};
// и дальше делаем хэш
export const generate_signature_hash = async (user_id: string, contract_id: string, date: string): Promise<string> => {
	const data_string = `${user_id}:${contract_id}:${date}:${SECRET_SALT}`;
	const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data_string);
	return hash.toUpperCase();
};
// парсим docx (локально)
export const parse_docx_templates = async (uri: string): Promise<string[]> => {
	try {
		// console.log('PDFCRAFT | parsing started...', uri);
		const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
		const zip = await JSZip.loadAsync(base64, { base64: true });
		// (DEBUG) проверяем, что вообще видит jszip внутри архива
		// const files = Object.keys(zip.files);
		// console.log('PDFCRAFT | files inside:', files.slice(0, 10), files.length > 10 ? '...and ' : '');
		const doc_xml = await zip.file('word/document.xml')?.async('text');
		if (!doc_xml) { console.log('PDFCRAFT | (word/document.xml) not found!'); return [] };
		const clean_text = doc_xml.replace(/<[^>]+>/g, ''); const matches = clean_text.match(/\{\{(.+?)\}\}/g) || [];
		const result = Array.from(new Set(matches.map(m => { return m.replace(/[\{\}\s\xa0]/g, '') }))).filter(Boolean);
		// console.log('PDFCRAFT | parsed: ', result);
		return result;
	} catch (e) { console.log('PDFCRAFT | parsing error: ', e); return [] }
};
// наконец-то делаем docx (отправляем под конвертацию на мой render)
// github.com/mrchn/pdfcraft-mobile-backend - CHECK HERE
export const generate_docx = async (template_uri: string, data: Record<string, string>, original_title: string) => {
	try {
		// читаем исходный шаблон в base64 и скармливаем jszip
		const base64 = await FileSystem.readAsStringAsync(template_uri, { encoding: 'base64' });
		const zip = await JSZip.loadAsync(base64, { base64: true });
		// вытаскиваем xml с текстом
		let doc_xml = await zip.file('word/document.xml')?.async('text'); if (!doc_xml) return null;
		// проходим по всем заполненным полям из формы и заменяем их в xml
		Object.entries(data).forEach(([key, value]) => {
			const xml_tag = '(?:<[^>]+>)*';
			const escaped_key_chars = key.split('').map(char => char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join(xml_tag);
			const regex_str = `\\{${xml_tag}\\{${xml_tag}\\s*${xml_tag}${escaped_key_chars}\\s*${xml_tag}\\}${xml_tag}\\}`;
			const regex = new RegExp(regex_str, 'g');
			doc_xml = doc_xml!.replace(regex, value);
		});
		zip.file('word/document.xml', doc_xml);
		const output_base64 = await zip.generateAsync({ type: 'base64' });
		const new_title = `crafted_${original_title}`; // имя файла на выходе
		const new_uri = FileSystem.documentDirectory + new_title;
		await FileSystem.writeAsStringAsync(new_uri, output_base64, { encoding: 'base64' });
		// console.log('PDFCRAFT | crafted:', new_uri);
		return new_uri;
	} catch (e) { console.log('PDFCRAFT | docx generate error:', e); return null }
};
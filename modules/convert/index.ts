// @/modules/convert (pdfcraft-mobile)

import { NativeModules } from 'react-native';

export async function localConvert (
	docxPath: string, outputPath: string
): Promise<boolean> {

	const ConvertModule = NativeModules.Convert || NativeModules.ExpoConvert;
	if (!Convert) return false;
	try {
		const cleanDocx = docxPath.replace('file://', '');
		const cleanOutput = outputPath.replace('file://', '');
		return await ConvertModule.convert(cleanDocx, cleanOutput);
	} catch { return false }
}
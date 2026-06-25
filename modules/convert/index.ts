// @/modules/convert (pdfcraft-mobile)

import { requireNativeModule } from 'expo-modules-core';

export async function localConvert (
	docxPath: string, outputPath: string
): Promise<boolean> {

	let ConvertModule: any;
	try { ConvertModule = requireNativeModule('Convert') }
	catch { return false }

	try {
		const cleanDocx = docxPath.replace('file://', '');
		const cleanOutput = outputPath.replace('file://', '');
		return await ConvertModule.convert(cleanDocx, cleanOutput);
	} catch { return false }
}
// @/modules/ios-native-convert/src/IosNativeConvertModule.ts

import { requireNativeModule } from 'expo';

interface IosNativeConvertModule {
	convert(docxPath: string, outputPath: string): Promise<boolean>
}

const convertModule = requireNativeModule<IosNativeConvertModule>('IosNativeConvert');
export default convertModule
// @/modules/ios-native-convert/src/IosNativeConvertModule.ts (pdfcraft-mobile)

import { NativeModule, requireNativeModule } from 'expo-modules-core';

declare class IosNativeConvertModule extends NativeModule {
	convert(docxPath: string, outputPath: string): Promise<boolean>
}

export default requireNativeModule<IosNativeConvertModule>('IosNativeConvert')
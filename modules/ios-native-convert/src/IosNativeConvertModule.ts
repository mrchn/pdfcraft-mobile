// @/modules/ios-native-convert/src/IosNativeConvertModule.ts (pdfcraft-mobile)

import { NativeModule, requireNativeModule } from 'expo-modules-core';

declare class IosNativeConvertModule extends NativeModule {
	convert(docxPath: string, outputPath: string): Promise<boolean>
}

let _mod: IosNativeConvertModule | null = null;

try { _mod = requireNativeModule<IosNativeConvertModule>('IosNativeConvert') }
catch {}

export default _mod
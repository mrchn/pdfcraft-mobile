// @/theme/helpers (pdfcraft-mobile)

import { StyleSheet } from 'react-native';
import { Colors, Theme } from './colors';

export const ROW = {
	alignItems: 'center',
	flexDirection: 'row'
};

export const CENTER = {
	alignItems: 'center',
	justifyContent: 'center'
};

export const text = (color: string, size: number) => ({
	fontFamily: 'ui-monospace', color, fontSize: size
});

const cache = new Map<string, any>();

export const createStyles = <T>(

	key: string, mode: Theme,
	build: (c: typeof Colors[Theme]) => T) => {

	const k = `${key}_${mode}`;
	if (!cache.has(k)) cache.set(k, build(Colors[mode]));
	return cache.get(k)

}
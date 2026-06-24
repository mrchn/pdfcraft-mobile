// @/theme/colors (pdfcraft-mobile)

import { useColorScheme } from 'react-native';

export const Colors = {

	light: {

		bg: '#F2F2F7', modalBg: '#F2F2F7',
		bgBlur: 'rgba(255, 255, 255, 0.6)',
		text: '#000', info: '#8E8E93',
		card: '#FFF',
		btn: 'rgba(0, 0, 0, 0.32)',
		highlight: 'rgba(255, 255, 255, 0.8)'

	}, dark: {

		bg: '#000', modalBg: '#1C1C1E',
		bgBlur: 'rgba(44, 44, 46, 0.6)',
		text: '#FFF', info: '#8E8E93',
		card: '#1C1C1E',
		btn: 'rgba(255, 255, 255, 0.35)',
		highlight: 'rgba(255, 255, 255, 0.2)'

	}

} as const;

export type Theme = keyof typeof Colors

export const useAppTheme = <T>(fn: (mode: Theme) => T) =>
	fn(useColorScheme() ?? 'light')
// @/app/theme
import {StyleSheet, Platform, useColorScheme} from 'react-native';

export const Colors = {
	light: {
		bg: '#F2F2F7', bgBlur: 'rgba(255, 255, 255, 0.6)',
		text: '#000000', info: '#8E8E93', card: '#FFFFFF',
		highlight: 'rgba(255, 255, 255, 0.8)',
		btn: 'rgba(0, 0, 0, 0.32)', btnInner: '#848487'
	}, dark: {
		bg: '#000000', bgBlur: 'rgba(44, 44, 46, 0.6)',
		text: '#FFFFFF', info: '#8E8E93', card: '#1C1C1E',
		highlight: 'rgba(255, 255, 255, 0.2)',
		btn: 'rgba(255, 255, 255, 0.35)', btnInner: '#A2A2A5'
	}
} as const;

export type Theme = 'light' | 'dark';
const cache: Record<string, any> = {};

export function useAppTheme<T>(
	themeSelect: (mode: 'dark' | 'light') => T): T {
	const mode = useColorScheme() === 'dark' ? 'dark' : 'light';
	return themeSelect(mode)
}

export const home = (mode: Theme) => {

	const key = `home_${mode}`;
	if (cache[key]) return cache[key];
	const c = Colors[mode];
	return (cache[key] = StyleSheet.create({

		root: { flex: 1, backgroundColor: c.bg },
		header: {
			flexDirection: 'row',
			alignItems: 'flex-end',
			justifyContent: 'space-between',
			paddingHorizontal: 20,
			paddingTop: 44, paddingBottom: 16
		},
		title: { // Ready to craft
			color: c.text, fontSize: 32,
			fontFamily: 'ui-monospace'
		},
		search_row: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: 16,
			marginBottom: 16
		},
		search: {
			backgroundColor: c.bgBlur,
			flex: 1, flexDirection: 'row',
			alignItems: 'center', height: 48,
			borderRadius: 16, borderWidth: 0.2,
			borderColor: c.highlight
		},
		search_input: {
			flex: 1, fontFamily: 'ui-monospace',
			color: c.text, fontSize: 17,
			paddingHorizontal: 16
		},
		cancel_text: { color: c.text },
		list_header: { marginBottom: 8 },
		list_content: {
			flexGrow: 1,
			paddingHorizontal: 16,
			paddingBottom: 100
		},
		section_label: {
			color: c.info, fontSize: 13,
			fontFamily: 'ui-monospace',
			paddingLeft: 16, marginBottom: 6
		},
		row: {
			backgroundColor: c.card,
			flexDirection: 'row', alignItems: 'center',
			paddingVertical: 20, paddingHorizontal: 16
		},
		icon_wrap: {
			backgroundColor: c.text, borderRadius: 8,
			width: 36, height: 36, marginRight: 12,
			alignItems: 'center', justifyContent: 'center',
		},
		row_meta: { flex: 1 },
		row_title: {
			color: c.text, fontSize: 17,
			marginBottom: 2, fontWeight: '400',
			fontFamily: 'ui-monospace'
		},
		row_sub: {
			color: c.info, fontSize: 12, fontWeight: '400'
		},
		swipeDelete: {
			backgroundColor: 'red',
			justifyContent: 'center',
			alignItems: 'center',
			width: 80, height: '100%',
		},
		empty: {
			flex: 1, alignItems: 'center', justifyContent: 'center',
			paddingBottom: 80, gap: 12
		},
		empty_text: {
			color: c.info, fontSize: 14, fontFamily: 'ui-monospace'
		},
		fab_wrapper: {
			position: 'absolute',
			bottom: 24, right: 24,
			borderRadius: 32,
			overflow: 'hidden',
		},
		fab_glass: {
			// position: 'absolute', bottom: 32, right: 24,
			width: 64, height: 64,
			borderRadius: 32,
			// backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 44, 46, 0.6)',
			// borderWidth: 0.5,
			// borderColor: c.highlight,
			alignItems: 'center', justifyContent: 'center',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: mode === 'light' ? 0.12 : 0.3,
			shadowRadius: 12,
		},
		fab: {
			position: 'absolute', bottom: 32, right: 24,
			width: 64, height: 64,
			borderRadius: 32,
			backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 44, 46, 0.6)',
			borderWidth: 0.5,
			borderColor: c.highlight,
			alignItems: 'center', justifyContent: 'center',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: mode === 'light' ? 0.12 : 0.3,
			shadowRadius: 12,
		}
	}))
};

export const form = (mode: Theme) => {
	const key = `form_${mode}`;
	if (cache[key]) return cache[key];
	const c = Colors[mode];
	return (cache[key] = StyleSheet.create({

		safe: {
			flex: 1,
			backgroundColor: mode === 'light' ? '#F2F2F7' : '#1C1C1E'
		},
		header: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center', padding: 20
		},
		scroll_content: {
			padding: 20
		},
		section_title: {
			fontFamily: 'ui-monospace',
			color: c.text, fontSize: 22,
			marginTop: 20, marginBottom: 10,
		},
		fields_empty: {
			color: c.info,
			marginTop: 10, textAlign: 'center'
		},

		input: {
			backgroundColor: 'rgba(255, 255, 255, 0.06)',
			color: c.text,
			padding: 16,
			marginBottom: 12,
			borderRadius: 14,
			fontSize: 17,
			borderWidth: 1,
			borderColor: mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
		},
		submit_btn_wrap: {
			paddingHorizontal: 20,
			paddingBottom: Platform.OS === 'ios' ? 70 : 50,
		},
		submit_btn: {
			alignSelf: 'center', backgroundColor: c.text,
			paddingVertical: 16,
			borderRadius: 16, alignItems: 'center',
			justifyContent: 'center',
			marginTop: 20, width: '100%',

			borderWidth: 1,
			borderColor: mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)',
			shadowColor: c.text,
			shadowOffset: { width: 0, height: 6 },
			shadowOpacity: mode === 'light' ? 0.25 : 0.4,
			shadowRadius: 12,
		},
		submit_text: {
			color: c.bg, fontSize: 17, fontWeight: '600',
			fontFamily: 'ui-monospace',
		},
		indicator: {
			position: 'absolute', top: 0, left: 0,
			right: 0, bottom: 0, alignItems: 'center',
			backgroundColor: 'rgba(0,0,0,0.0)',
			justifyContent: 'center', zIndex: 9999
		},
		indicator_text: {
			color: c.text,
			marginTop: 16, fontFamily: 'ui-monospace'
		},
		closeBtn: { size: 48, color: c.btn }
	}))
};

export default function Route() { return null }
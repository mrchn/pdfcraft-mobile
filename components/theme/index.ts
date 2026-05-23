// @/components/theme
// material.io/blog/material-3-expressive

// react components
import { StyleSheet, Platform } from 'react-native';

// project components
import { Fonts } from '@/components/theme/fonts';
import { Shape } from '@/components/theme/shapes';
import { Colors } from '@/components/theme/colors';
import { Motion } from '@/components/theme/motion';
import { TypeScale } from '@/components/theme/typescale';
import { Elevation } from '@/components/theme/elevation';

export type ThemeType = 'light' | 'dark';
const cache: Record<string, any> = {};

export const home = (mode: ThemeType) => {

	const cache_key = `home_${mode}`;
	if (cache[cache_key]) return cache[cache_key];
	const c = Colors[mode];
	return (cache[cache_key] = StyleSheet.create({

		// ROOT, HEADER & BACKGROUND
		root: { flex: 1, backgroundColor: c.surface },
		bg: {
			...StyleSheet.absoluteFillObject,
			backgroundColor: c.surface
		},
		header: {
			flexDirection: 'row', alignItems: 'flex-end',
			justifyContent: 'space-between',
			backgroundColor: c.surface, paddingHorizontal: 20,
			paddingTop: 44, paddingBottom: 16,
		},
		title_wrap: { height: 40, overflow: 'hidden' },
		title: {
			...TypeScale.headlineLarge,
			color: c.onSurface, fontFamily: 'GoogleSansBold'
		},
		header_btn: { paddingBottom: 4 },
		header_btn_ripple: { // android ripple
			color: 'rgba(208,188,255,0.2)',
			borderless: true, radius: 20
		},

		// SEARCH BAR
		// m3 uses extra large shape (28dp) pill
		search_row: {
			flexDirection: 'row', alignItems: 'center',
			paddingHorizontal: 16, marginBottom: 16, gap: 8
		},
		search_blur: {
			flex: 1, flexDirection: 'row',
			alignItems: 'center',
			borderRadius: Shape.extraLarge,
			overflow: 'hidden', height: 56,
			backgroundColor: c.surfaceContainerHigh,
			borderWidth: 0
		},
		search_input: {
			flex: 1, color: c.onSurface,
			...TypeScale.bodyLarge,
			paddingHorizontal: 16, paddingVertical: 0,
			fontFamily: 'GoogleSansBold'
		},
		cancel_btn: { paddingHorizontal: 8 },
		cancel_text: {
			color: c.primary,
			...TypeScale.labelLarge,
			fontFamily: 'GoogleSansBold'
		},

		// LIST OF DOCS
		list: { flex: 1 },
		list_header: { marginBottom: 8 },
		list_content: {
			flexGrow: 1,
			paddingHorizontal: 16,
			paddingBottom: 100
		},
		section_label: {
			...TypeScale.labelMedium,
			color: c.onSurfaceVariant,
			textTransform: 'uppercase',
			paddingLeft: 4,
			fontFamily: 'GoogleSansBold'
		},

		// LIST ROWS (card-like)
		// m3: filled surface, medium shape (12dp)
		row: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: 16,
			paddingHorizontal: 16,
			backgroundColor: c.surfaceContainerLow
		},
		icon_wrap: {
			width: 40, height: 40,
			borderRadius: Shape.medium,
			alignItems: 'center',
			justifyContent: 'center',
			marginRight: 12,
			backgroundColor: c.secondaryContainer
		},
		row_meta: { flex: 1 },
		row_title: {
			...TypeScale.bodyLarge,
			color: c.onSurface, marginBottom: 2,
			fontFamily: 'GoogleSansBold'
		},
		row_sub: {
			...TypeScale.bodySmall,
			color: c.onSurfaceVariant,
			fontFamily: 'GoogleSansBold'
		},
		empty: {
			flex: 1, alignItems: 'center',
			justifyContent: 'center',
			paddingBottom: 80, gap: 12
		},
		empty_text: {
			...TypeScale.bodyMedium,
			color: c.onSurfaceVariant,
			fontFamily: 'GoogleSansBold'
		},

		// FAB — extra large shape (28dp)
		// larger shadow, spring bounce
		fab_wrap: {
			position: 'absolute', bottom: 32,
			right: 24, borderRadius: Shape.extraLarge,
			overflow: 'hidden', shadowColor: c.primary,
			shadowOffset: { width: 0, height: 6 },
			shadowOpacity: 0.35, shadowRadius: 16,
			elevation: Elevation.level3.elevation
		},
		fab: {
			width: 64, height: 64,
			borderRadius: Shape.extraLarge,
			backgroundColor: c.primaryContainer,
			alignItems: 'center', justifyContent: 'center'
		},

		// SETTINGS MODAL
		modal_bg: {
			flex: 1, justifyContent: 'flex-end',
			backgroundColor: 'rgba(0,0,0,0)'
		},
		menu_bg: {
			backgroundColor: c.surfaceContainerLow,
			padding: 24, borderTopLeftRadius: 28,
			borderTopRightRadius: 28, paddingBottom: 40
		},
		menu_handle: {
			width: 40, height: 4,
			backgroundColor: c.outlineVariant,
			borderRadius: 2, alignSelf: 'center',
			marginBottom: 16
		},
		menu_title: {
			color: c.onSurface,
			fontSize: 18, fontFamily: 'GoogleSansBold',
			marginBottom: 16
		},
		menu_info: {
			color: c.onSurface, marginBottom: 16,
			fontSize: 16, fontFamily: 'GoogleSansRegular'
		},
		menu_link: {
			color: c.primary,
			textDecorationLine: 'underline'
		}
	}))
};

export const form = (mode: ThemeType) => {

	const cache_key = `form_${mode}`;
	if (cache[cache_key]) return cache[cache_key];
	const c = Colors[mode];
	return (cache[cache_key] = StyleSheet.create({

		safe: { flex: 1, backgroundColor: '#1C1C1E' },
		header: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center', padding: 20
		},
		title: {
			...TypeScale.titleLarge,
			color: c.onSurface
		},
		scroll_content: {
			padding: 20
		},
		section_title: {
			...TypeScale.labelLarge,
			color: c.primary,
			textTransform: 'uppercase',
			fontSize: 20, marginBottom: 10,
			marginTop: 20, letterSpacing: 0.8,
			fontFamily: 'CaveatBold'
		},
		fields_empty: {
			color: '#FF453A',
			marginTop: 10, textAlign: 'center'
		},

		// FILLED TEXT FIELD — m3 standard
		input: {
			backgroundColor: c.surfaceContainerHighest,
			color: c.onSurface, padding: 16, marginBottom: 12,
			borderRadius: Shape.extraSmall,
			borderBottomWidth: 1, borderBottomColor: c.outline,
			...TypeScale.bodyLarge
		},
		// FILLED BUTTON — m3 primary action
		submit_btn_wrap: {
			paddingHorizontal: 20,
			paddingBottom: Platform.OS === 'ios' ? 50 : 20,
			backgroundColor: '#1C1C1E'
		},
		submit_btn: {
			alignSelf: 'center', backgroundColor: c.primary,
			paddingVertical: 16, paddingHorizontal: 14,
			borderRadius: Shape.full, alignItems: 'center',
			marginTop: 20, width: '75%'
		},
		submit_text: {
			color: c.onPrimary, ...TypeScale.labelLarge,
			fontWeight: '700', fontSize: 18,
			fontFamily: 'GoogleSansBold'
		},
		indicator: {
			position: 'absolute', top: 0, left: 0,
			right: 0, bottom: 0, alignItems: 'center',
			backgroundColor: 'rgba(0,0,0,0.0)',
			justifyContent: 'center', zIndex: 9999
		},
		indicator_text: {
			color: Colors.dark.onSurface,
			marginTop: 16, fontFamily: 'GoogleSansBold'
		}
	}))
};
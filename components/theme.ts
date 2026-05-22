// @/components/theme (pdfcraft-mobile) - md3: material.io/blog/material-3-expressive
import { Platform, StyleSheet } from 'react-native';

export const Colors = {
	light: {
		primary: '#6750A4', onPrimary: '#FFFFFF', primaryContainer: '#EADDFF', onPrimaryContainer: '#21005D',
		secondary: '#625B71', onSecondary: '#FFFFFF', secondaryContainer: '#E8DEF8', onSecondaryContainer: '#1D192B',
		tertiary: '#7D5260', onTertiary: '#FFFFFF', tertiaryContainer: '#FFD8E4', onTertiaryContainer: '#31111D',
		error: '#B3261E', onError: '#FFFFFF', errorContainer: '#F9DEDC', onErrorContainer: '#410E0B',
		outline: '#79747E', outlineVariant: '#CAC4D0', scrim: '#000000',
		inverseSurface: '#313033', inverseOnSurface: '#F4EFF4', inversePrimary: '#D0BCFF',
		// semantic aliases (used in StyleSheet below)
		background: '#FEF7FF', tint: '#6750A4', icon: '#49454F', tabIconDefault: '#79747E', tabIconSelected: '#6750A4',
		// surfaces — tonal elevation via color, not shadow
		surface: '#FEF7FF', onSurface: '#1C1B1F', surfaceVariant: '#E7E0EC', onSurfaceVariant: '#49454F',
		surfaceContainerLowest: '#FFFFFF', surfaceContainerLow: '#F7F2FA', surfaceContainer: '#F3EDF7',
		surfaceContainerHigh: '#ECE6F0', surfaceContainerHighest: '#E6E0E9'
	}, dark: {
		primary: '#D0BCFF', onPrimary: '#381E72', primaryContainer: '#4F378B', onPrimaryContainer: '#EADDFF',
		secondary: '#CCC2DC', onSecondary: '#332D41', secondaryContainer: '#4A4458', onSecondaryContainer: '#E8DEF8',
		tertiary: '#EFB8C8', onTertiary: '#492532', tertiaryContainer: '#633B48', onTertiaryContainer: '#FFD8E4',
		error: '#F2B8B5', onError: '#601410', errorContainer: '#8C1D18', onErrorContainer: '#F9DEDC',
		outline: '#938F99', outlineVariant: '#49454F', scrim: '#000000',
		inverseSurface: '#E6E0E9', inverseOnSurface: '#322F35', inversePrimary: '#6750A4',
		// semantic aliases (used in StyleSheet below)
		background: '#141218', tint: '#D0BCFF', icon: '#CAC4D0', tabIconDefault: '#938F99', tabIconSelected: '#D0BCFF',
		// surfaces — dark tonal palette
		surface: 'black', onSurface: '#E6E0E9', surfaceVariant: '#49454F', onSurfaceVariant: '#CAC4D0',
		surfaceContainerLowest: '#0F0D13', surfaceContainerLow: '#1D1B20', surfaceContainer: '#211F26',
		surfaceContainerHigh: '#2B2930', surfaceContainerHighest: '#36343B'
	}
} as const;
export const Shape = { extraSmall: 4, small: 8, medium: 12, large: 16, extraLarge: 28, full: 9999 } as const;
export const Fonts = Platform.select({
	ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
	default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif", rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
	}
});
export const TypeScale = {
	displayLarge: { fontSize: 57, lineHeight: 64, fontWeight: '400' as const, letterSpacing: -0.25 },
	displayMedium: { fontSize: 45, lineHeight: 52, fontWeight: '400' as const, letterSpacing: 0 },
	displaySmall: { fontSize: 36, lineHeight: 44, fontWeight: '400' as const, letterSpacing: 0 },
	headlineLarge: { fontSize: 32, lineHeight: 40, fontWeight: '400' as const, letterSpacing: 0 },
	headlineMedium: { fontSize: 28, lineHeight: 36, fontWeight: '400' as const, letterSpacing: 0 },
	headlineSmall: { fontSize: 24, lineHeight: 32, fontWeight: '400' as const, letterSpacing: 0 },
	titleLarge: { fontSize: 22, lineHeight: 28, fontWeight: '500' as const, letterSpacing: 0 },
	titleMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const, letterSpacing: 0.15 },
	titleSmall: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const, letterSpacing: 0.1 },
	bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const, letterSpacing: 0.5 },
	bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const, letterSpacing: 0.25 },
	bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const, letterSpacing: 0.4 },
	labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: '500' as const, letterSpacing: 0.1 },
	labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const, letterSpacing: 0.5 },
	labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500' as const, letterSpacing: 0.5 },
} as const;
export const Motion = {
	spring: { damping: 20, stiffness: 300, mass: 1, overshootClamping: false },
	springExpressive: { damping: 14, stiffness: 250, mass: 1, overshootClamping: false },
	// durations (ms) for non-spring animations
	durationShort1: 50, durationShort2: 100, durationMedium1: 200,
	durationMedium2: 300, durationLong1:   450, durationLong2:   600,
	// easing names (use with Easing from react-native)
	emphasizedEasing: 'cubic-bezier(0.2, 0, 0, 1.0)', emphasizedDecelerating: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
	emphasizedAccelerating: 'cubic-bezier(0.3, 0, 0.8, 0.15)', standardEasing: 'cubic-bezier(0.2, 0, 0, 1.0)',
} as const;
export const Elevation = {
	level0: { shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
	level1: { shadowOpacity: 0.12, shadowRadius: 2, elevation: 1 },
	level2: { shadowOpacity: 0.14, shadowRadius: 6, elevation: 3 },
	level3: { shadowOpacity: 0.15, shadowRadius: 10, elevation: 6 },
	level4: { shadowOpacity: 0.16, shadowRadius: 12, elevation: 8 },
	level5: { shadowOpacity: 0.18, shadowRadius: 16, elevation: 12 },
} as const;

const c = Colors.dark; // Colors.light для светлой темы
export const theme_homescreen = StyleSheet.create({
	// root, header & background
	root: { flex: 1, backgroundColor: c.surface },
	bg: { ...StyleSheet.absoluteFillObject, backgroundColor: c.surface },
	header: {
		flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
		paddingHorizontal: 20, paddingTop: 44, paddingBottom: 16, backgroundColor: c.surface,
	},
	title: { ...TypeScale.headlineLarge, color: c.onSurface, fontFamily: 'GoogleSansBold', },
	header_btn: { paddingBottom: 4 },
	// search bar — m3-expressive uses extra large shape (28dp) pill
	search_row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16, gap: 8, },
	search_blur: {
		flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: Shape.extraLarge,
		overflow: 'hidden', height: 56, backgroundColor: c.surfaceContainerHigh, borderWidth: 0,
	},
	search_input: {
		flex: 1, color: c.onSurface, ...TypeScale.bodyLarge,
		paddingHorizontal: 16, paddingVertical: 0, fontFamily: 'GoogleSansBold',
	},
	cancel_btn: { paddingHorizontal: 8 },
	cancel_text: { color: c.primary, ...TypeScale.labelLarge, fontFamily: 'GoogleSansBold', },
	// list of docs
	list: { flex: 1 }, list_header: { marginBottom: 8 },
	list_content: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 100 },
	section_label: {
		...TypeScale.labelMedium, color: c.onSurfaceVariant,
		textTransform: 'uppercase', paddingLeft: 4, fontFamily: 'GoogleSansBold',
	},
	// list rows — m3: card-like, filled surface, medium shape (12dp)
	row: {
		flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16,
		backgroundColor: c.surfaceContainerLow,
	},
	icon_wrap: {
		width: 40, height: 40, borderRadius: Shape.medium, alignItems: 'center', justifyContent: 'center',
		marginRight: 12, backgroundColor: c.secondaryContainer,
	},
	row_meta: { flex: 1 },
	row_title: { ...TypeScale.bodyLarge, color: c.onSurface, marginBottom: 2, fontFamily: 'GoogleSansBold', },
	row_sub: { ...TypeScale.bodySmall, color: c.onSurfaceVariant, fontFamily: 'GoogleSansBold', },
	empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80, gap: 12 },
	empty_text: { ...TypeScale.bodyMedium, color: c.onSurfaceVariant, fontFamily: 'GoogleSansBold', },
	// fab — m3-expressive: extra large shape (28dp), larger shadow, spring bounce
	fab_wrap: {
		position: 'absolute', bottom: 32, right: 24, borderRadius: Shape.extraLarge,
		overflow: 'hidden', shadowColor: c.primary, shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.35, shadowRadius: 16, elevation: Elevation.level3.elevation,
	},
	fab: {
		width: 64, height: 64, borderRadius: Shape.extraLarge,
		backgroundColor: c.primaryContainer, alignItems: 'center', justifyContent: 'center',
	},
});
export const theme_form = StyleSheet.create({
	header: {
		flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20,
		borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.outlineVariant,
		backgroundColor: c.surfaceContainerLow,
	},
	title: { ...TypeScale.titleLarge, color: c.onSurface, }, scroll_content: { padding: 20 },
	section_title: {
		...TypeScale.labelLarge, color: c.primary, textTransform: 'uppercase',
		marginBottom: 10, marginTop: 20, letterSpacing: 0.8,
	},
	input: { // filled text field — m3 standard
		backgroundColor: c.surfaceContainerHighest, color: c.onSurface, padding: 16, marginBottom: 12,
		borderRadius: Shape.extraSmall, borderBottomWidth: 1, borderBottomColor: c.outline, ...TypeScale.bodyLarge,
	},
	submit_btn: { // filled button — m3 primary action
		backgroundColor: c.primary, paddingVertical: 16, paddingHorizontal: 24,
		borderRadius: Shape.full, alignItems: 'center', marginTop: 20,
	},
	submit_text: { color: c.onPrimary, ...TypeScale.labelLarge, fontWeight: '700', },
	indicator: {
		position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center',
		backgroundColor: 'rgba(20,18,24,0.8)', justifyContent: 'center', zIndex: 9999
	},
	indicator_text: { color: Colors.dark.onSurface, marginTop: 16, fontFamily: 'GoogleSansBold' }
});
export const theme_menu = StyleSheet.create({
	modal_bg: { flex: 1, backgroundColor: 'rgba(0,0,0,0)', justifyContent: 'flex-end' },
	bg: {
		backgroundColor: Colors.dark.surfaceContainerLow,
		padding: 24, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 40
	},
	handle: {
		width: 40, height: 4, backgroundColor: Colors.dark.outlineVariant,
		borderRadius: 2, alignSelf: 'center', marginBottom: 16
	},
	title: { color: Colors.dark.onSurface, fontSize: 18, fontFamily: 'GoogleSansBold', marginBottom: 16 },
	info: { color: Colors.dark.onSurface, fontSize: 16, fontFamily: 'GoogleSansRegular', marginBottom: 16 },
	info_link: { color: Colors.dark.primary, textDecorationLine: 'underline' }
})
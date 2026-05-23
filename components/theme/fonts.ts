// @/components/theme/fonts

// react components
import { Platform } from 'react-native';

export const Fonts = Platform.select({

	ios: {
		sans: 'system-ui', serif: 'ui-serif',
		rounded: 'ui-rounded', mono: 'ui-monospace'
	},
	default: {
		sans: 'normal', serif: 'serif',
		rounded: 'normal', mono: 'monospace'
	},
	web: {
		serif: `Georgia, 'Times New Roman', serif`,
		sans:
			`
			system-ui, -apple-system, BlinkMacSystemFont,
			'Segoe UI', Roboto, Helvetica, Arial, sans-serif
			`,
		rounded:
			`
			'SF Pro Rounded',
			'Hiragino Maru Gothic ProN', sans-serif
			`,
		mono:
			`
			SFMono-Regular, Menlo, Monaco,
			Consolas, 'Courier New', monospace
			`
	}

});
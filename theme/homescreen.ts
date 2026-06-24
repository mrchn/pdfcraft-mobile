// @/theme/homescreen (pdfcraft-mobile)

import { StyleSheet } from 'react-native';
import { createStyles, ROW, CENTER, text } from './helpers';
import { Theme } from './colors';

export const home = (mode: Theme) =>
	createStyles('home', mode, c =>
		StyleSheet.create({

			root: {
				flex: 1,
				backgroundColor: c.bg
			},
			header: {
				...ROW,
				justifyContent: 'space-between',
				paddingHorizontal: 20,
				paddingTop: 44,
				paddingBottom: 16
			},
			title: text(c.text, 32),
			search_row: {
				...ROW,
				paddingHorizontal: 16,
				marginBottom: 16
			},
			search: {
				...ROW,
				flex: 1,
				backgroundColor: c.bgBlur,
				height: 48,
				borderRadius: 16,
				borderWidth: 0.2,
				borderColor: c.highlight
			},
			search_input: {
				...text(c.text, 17),
				flex: 1,
				paddingHorizontal: 16
			},
			list_content: {
				flexGrow: 1,
				paddingHorizontal: 16,
				paddingBottom: 100
			},
			section_label: {
				...text(c.info, 13),
				paddingLeft: 16,
				marginBottom: 6
			},
			row: {
				...ROW,
				backgroundColor: c.card,
				paddingVertical: 20,
				paddingHorizontal: 16
			},
			icon_wrap: {
				...CENTER,
				backgroundColor: c.text,
				borderRadius: 8,
				width: 36, height: 36,
				marginRight: 12
			},
			row_title: text(c.text, 17),
			row_sub: text(c.info, 12),
			swipeDelete: {
				...CENTER,
				backgroundColor: 'red',
				width: 80
			},
			empty: {
				...CENTER, flex: 1,
				paddingBottom: 80,
				gap: 12
			},
			empty_text: text(c.info, 14),
			fab: {
				...CENTER,
				position: 'absolute',
				bottom: 32, right: 24,
				width: 64, height: 64,
				borderRadius: 32,
				backgroundColor: c.bgBlur,
				borderColor: c.highlight,
				borderWidth: 0.5
			}

		})
)
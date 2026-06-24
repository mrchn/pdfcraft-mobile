// @/theme/form (pdfcraft-mobile)

import { StyleSheet } from 'react-native';
import { createStyles, ROW, CENTER, text } from './helpers';
import { Theme } from './colors';

export const form = (mode: Theme) =>
	createStyles('form', mode, c =>
		StyleSheet.create({

			safe: {
				flex: 1,
				backgroundColor: c.modalBg
			},
			header: {
				...ROW,
				justifyContent: 'space-between',
				padding: 20
			},
			section_title: {
				...text(c.text, 22),
				marginTop: 20,
				marginBottom: 20
			},
			fields_empty: {
				color: c.info,
				marginTop: 10,
				textAlign: 'center'
			},
			input: {
				...text(c.text, 17),
				backgroundColor: c.highlight,
				padding: 16,
				marginBottom: 12,
				borderRadius: 14,
				borderWidth: 1,
				borderColor: c.highlight
			},
			submit_btn_wrap: {
				paddingHorizontal: 20,
				paddingBottom: 70
			},
			submit_btn: {
				...CENTER,
				width: '100%',
				backgroundColor: c.text,
				paddingVertical: 16,
				borderRadius: 16,
				marginTop: 20
			},
			submit_text: text(c.bg, 17),
			indicator: {
				...CENTER,
				...StyleSheet.absoluteFillObject,
				backgroundColor: 'rgba(0,0,0,0.6)',
				zIndex: 9999
			},
			indicator_text: {
				...text(c.text, 14),
				marginTop: 16
			},
			closeBtn: {
				size: 48,
				color: c.btn
			}

		})
)
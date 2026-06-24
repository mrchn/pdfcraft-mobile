/* eslint-disable import/no-named-as-default-member */
// @/locales

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import ru from './ru.json';
import en from './en.json';

const LANGUAGE_KEY = 'user-language';

i18n.use(initReactI18next).init({
	lng: 'en',
	resources: {
		ru: { translation: ru },
		en: { translation: en }
	},
	fallbackLng: 'en',
	interpolation: { escapeValue: false }
});

const initLanguage = async () => {
	try {
		const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
		if (saved) { i18n.changeLanguage(saved) }
		else {
			const deviceLang = Localization.getLocales()[0]?.languageCode;
			if (deviceLang && ['en', 'ru'].includes(deviceLang)) {
				i18n.changeLanguage(deviceLang)
			}
		}
	} catch {}
};

initLanguage();
export default i18n
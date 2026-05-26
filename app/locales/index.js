/* eslint-disable import/no-named-as-default-member */
// @/app/locales
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import ru from './ru.json';
import en from './en.json';

const LANGUAGE_KEY = 'user-language';

i18n.use(initReactI18next).init({
	lng: Localization.getLocales()[0]?.languageCode ?? 'en',
	resources: {
		ru: { translation: ru },
		en: { translation: en }
	},
	fallbackLng: 'en',
	interpolation: { escapeValue: false }
});

AsyncStorage.getItem(LANGUAGE_KEY)
	.then(saved => { if (saved) i18n.changeLanguage(saved) })
	.catch(() => {});

export default i18n
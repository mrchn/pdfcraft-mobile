// @/app/_layout

import 'react-native-reanimated';
import '@/locales';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, Settings, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
	DarkTheme, DefaultTheme,
	ThemeProvider } from '@react-navigation/native';

export default function RootLayout() {

	const theme = useColorScheme()==='dark'?DarkTheme:DefaultTheme

	useEffect(() => { if (Platform.OS === 'ios') {
		const version = Constants.expoConfig?.version ?? 'undefined';
		Settings.set({app_version: `${version}`});
	}}, []);

	return (
		<GestureHandlerRootView style={{flex: 1}}>
			<ThemeProvider value={theme}>
				<Stack>
					<Stack.Screen
						name='index' options={{headerShown:false}}/>
				</Stack>
				<StatusBar style='auto'/>
			</ThemeProvider>
		</GestureHandlerRootView>
	)
}
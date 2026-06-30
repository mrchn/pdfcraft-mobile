// @/app/_layout

import 'react-native-reanimated'
import '@/locales'
import { useEffect } from 'react'
import { Stack } from 'expo-router'
import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme, Settings, Platform } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import {
	DarkTheme, DefaultTheme,
	ThemeProvider } from '@react-navigation/native'

export default function RootLayout() {

	useEffect(() => {
		const config = Constants.expoConfig
		Settings.set({
			app_version: config?.version ?? 'undefined',
			app_build_number: config?.ios?.buildNumber ?? 'undefined'
		})
	}, [])

	return (
		<GestureHandlerRootView style={{flex: 1}}>
			<ThemeProvider
				value={
					useColorScheme() === 'dark'?DarkTheme:DefaultTheme
				}
			>
				<Stack>
					<Stack.Screen
						name='index' options={{headerShown:false}}/>
				</Stack>
				<StatusBar style='auto'/>
			</ThemeProvider>
		</GestureHandlerRootView>
	)
}
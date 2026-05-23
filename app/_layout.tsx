// @/app/_layout

// react components
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { ThemeProvider } from '@react-navigation/native';
import 'react-native-reanimated';

// expo components
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

	// шрифты приложения
	const [fontsLoaded, error] = useFonts({
		GoogleSansRegular:
			require('../assets/fonts/googlesans-regular.ttf'),
		GoogleSansBold:
			require('../assets/fonts/googlesans-bold.ttf'),
		CaveatBold:
			require('../assets/fonts/caveat-bold.ttf')
	});

	const colorScheme = useColorScheme();

	// splash прячется как только шрифты загружены
	useEffect(() => {
		if (fontsLoaded || error) { SplashScreen.hideAsync() }
	}, [fontsLoaded, error]);

	if (!fontsLoaded && !error) { return null; }

	return (
		<ThemeProvider
			value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<Stack>
				<Stack.Screen
					name='index' options={{ headerShown: false }}
				/>
			</Stack>
			<StatusBar style='auto'/>
		</ThemeProvider>
	);
}
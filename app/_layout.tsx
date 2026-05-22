// @/app/_layout (pdfcraft-mobile)
import React from 'react'; import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router'; import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font'; import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.hideAsync();

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		GoogleSansRegular: require('../assets/fonts/googlesans-regular.ttf'),
		GoogleSansBold: require('../assets/fonts/googlesans-bold.ttf'),
		CaveatBold: require('../assets/fonts/caveat-bold.ttf')
	});
	const colorScheme = useColorScheme();
	if (!fontsLoaded) { return null; }
	return (
	<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
		<Stack>
			<Stack.Screen name='index' options={{ headerShown: false }} />
		</Stack>
		<StatusBar style='auto'/>
	</ThemeProvider>
	);
}
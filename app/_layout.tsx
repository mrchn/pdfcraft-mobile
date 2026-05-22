// @/app/_layout (pdfcraft-mobile)
import React from 'react'; import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router'; import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font'; import 'react-native-reanimated';

export default function RootLayout() {
	const [fontsLoaded] = useFonts({ // шрифты
		GoogleSansRegular: require('../assets/fonts/googlesans-regular.ttf'),
		GoogleSansBold: require('../assets/fonts/googlesans-bold.ttf'),
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
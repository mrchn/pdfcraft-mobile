// @/app/index (pdfcraft-mobile)
import React, { useState, useEffect } from 'react'; import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, View, Text, Pressable, Modal, Platform, Linking } from 'react-native';
import Constants from 'expo-constants'; import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { HeaderSearch } from '@/components/ui/header'; import { DocumentList } from '@/components/ui/list';
import { theme_homescreen as theme, theme_menu, Colors } from '@/components/theme';

export default function homescreen() {
	// фразы в тайтле
	const phrases = ['pdfcraft-mobile', 'ready to craft']; const [phrase_idx, set_phrase_idx] = useState(0);
	useEffect(() => { const timer = setTimeout(() => { set_phrase_idx(1) }, 3000); return () => clearTimeout(timer) }, []);
	// стейты для поиска, хедера и меню настроек ->
	const [query, set_query] = useState(''); // стейт для searchbox
	const [has_docs, set_has_docs] = useState(false); // стейт счетчика в хедере
	const [menu_visible, set_menu_visible] = useState(false); // стейт модалки настроек
	return (
	<View style={theme.root}>
		<StatusBar barStyle='light-content' translucent backgroundColor='transparent'/>
		<View style={theme.bg}/>
		<SafeAreaView style={theme.safe_area}>
			<View style={theme.header}>
				<View style={{ height: 40, overflow: 'hidden' }}>
					<Animated.Text
						key={phrase_idx} entering={SlideInDown.duration(100).springify().damping(200)}
						exiting={SlideOutUp.duration(100)} style={theme.title}>
						{phrases[phrase_idx]}
					</Animated.Text>
				</View>
				<Pressable
					style={theme.header_btn}
					onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); set_menu_visible(true) }}
					android_ripple={{ color: 'rgba(208,188,255,0.2)', borderless: true, radius: 20 }}>
					<Ionicons name='ellipsis-horizontal-circle' size={28} color={Colors.dark.primary}/>
				</Pressable>
			</View>
			{has_docs && (
				<Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(200)}>
					<HeaderSearch query={query} set_query={set_query}/>
				</Animated.View>
			)}
			<DocumentList query={query} on_count_change={(count) => set_has_docs(count > 0)} is_menu_open={menu_visible}/>
		</SafeAreaView>
		<Modal
			visible={menu_visible} animationType='slide'
			transparent onRequestClose={() => set_menu_visible(false)}>
			<Pressable style={theme_menu.modal_bg} onPress={() => set_menu_visible(false)}>
				<Pressable style={theme_menu.bg}>
					<View style={theme_menu.handle}/>
					<Text style={theme_menu.title}>settings & info</Text>
					<Text style={theme_menu.info}>
						version {Constants.expoConfig?.version ?? 'undefined'} ({Platform.OS} {Platform.Version}){'\n'}
						<Text
							style={theme_menu.info_link}
							onPress={() => Linking.openURL('https://github.com/mrchn/pdfcraft-mobile')}
						>
							github.com/mrchn/pdfcraft-mobile
						</Text>
					</Text>
				</Pressable>
			</Pressable>
		</Modal>
	</View>
	);
}
// @/app/index (pdfcraft-mobile)

// react components
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pressable, Modal, View, Text } from 'react-native';
import { Platform, Linking, useColorScheme } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SlideInDown, SlideOutUp } from 'react-native-reanimated';

// expo components
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// project components
import { HeaderSearch } from '@/components/ui/header';
import { DocumentList } from '@/components/ui/list';
import { home as theme, Colors } from '@/components/theme';

export default function homescreen() {

	// dynamic theme
	const system_scheme = useColorScheme();
	const theme_mode:ThemeType=system_scheme==='dark'?'dark':'light';
	const sx = theme(theme_mode);
	const active_colors = Colors[theme_mode] || Colors.dark;

	const insets = useSafeAreaInsets();
	const github = 'https://github.com/mrchn/pdfcraft-mobile';

	// фразы в тайтле
	const phrases = ['pdfcraft-mobile', 'ready to craft'];
	const [phrase_idx, set_phrase_idx] = useState(0);

	useEffect(() => { // таймер смены фраз
		const timer = setTimeout(() => {
			set_phrase_idx(1)
		}, 3000);
		return () => clearTimeout(timer)
	}, []);

	// стейты для поиска, хедера и меню настроек ->
	const [query, set_query] = useState('');
	const [has_docs, set_has_docs] = useState(false);
	const [menu_visible, set_menu_visible] = useState(false);

	return (
		<View style={sx.root}>
			<StatusBar
				translucent style='light'
				backgroundColor='transparent'
			/>
			<View style={sx.bg}/>
			<View style={{ flex: 1, paddingTop: insets.top }}>
				<View style={sx.header}>
					<View style={{ height: 40, overflow: 'hidden' }}>
						<Animated.Text
							key={phrase_idx}
							entering={
								SlideInDown.duration(100)
									.springify()
									.damping(200)
								}
							exiting={SlideOutUp.duration(100)}
							style={sx.title}
						>
							{phrases[phrase_idx]}
						</Animated.Text>
					</View>
					<Pressable
						style={sx.header_btn}
						onPress={() => {
							Haptics.impactAsync(
								Haptics.ImpactFeedbackStyle.Light
								);
							set_menu_visible(true)
						}}
						android_ripple={{
							color: 'rgba(208,188,255,0.2)',
							borderless: true, radius: 20
						}}
					>
						<Ionicons
							size={28}
							name='ellipsis-horizontal-circle'
							color={Colors.dark.primary}
						/>
					</Pressable>
				</View>
				{has_docs && (
					<Animated.View
						entering={FadeIn.duration(250)}
						exiting={FadeOut.duration(200)}
					>
						<HeaderSearch
							query={query}
							set_query={set_query}
						/>
					</Animated.View>
				)}
				<DocumentList
					query={query}
					is_menu_open={menu_visible}
					on_count_change={
						(count) => set_has_docs(count > 0)
					}
				/>
			</View>
			<Modal
				transparent
				visible={menu_visible}
				animationType='slide'
				onRequestClose={() => set_menu_visible(false)}
			>
				<Pressable
					style={sx.modal_bg}
					onPress={() => set_menu_visible(false)}
				>
					<Pressable
						style={sx.menu_bg}
						onPress={() => {}}
					>
						<View style={sx.menu_handle}/>
						<Text style={sx.menu_title}>
							settings & info
						</Text>
						<Text style={sx.menu_info}>
							version{' '}
							{
								Constants.expoConfig?.version
								?? 'undefined'
							}
							{' '}
							({Platform.OS} {Platform.Version}){'\n'}
							<Text
								style={sx.menu_link}
								onPress={
									() => Linking.openURL(github)
								}
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
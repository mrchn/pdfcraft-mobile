// @/components/ui/header (pdfcraft-mobile)

// react components
import React, { useState, useRef } from 'react';
import { TextInput, Animated, View } from 'react-native';
import { Pressable, useColorScheme, Text } from 'react-native';

// expo and project components
import { Ionicons } from '@expo/vector-icons';
import { home as theme, Colors } from '@/components/theme';

// описываем типы для пропсов хедера
interface HeaderProps {
	query: string;
	set_query: (text: string) => void
}

export const HeaderSearch = ({ query, set_query }: HeaderProps) => {

	// dynamic theme
	const system_scheme = useColorScheme();
	const theme_mode:ThemeType=system_scheme==='dark'?'dark':'light';
	const sx = theme(theme_mode);
	const active_colors = Colors[theme_mode] || Colors.dark;

	const [
		is_search_focused,
		set_is_search_focused
	] = useState(false);
	const anim_cancel = useRef(new Animated.Value(0)).current;
	const search_ref = useRef<TextInput>(null);

	// анимации поиска
	const on_focus = () => { // тыкаем на поиск
		set_is_search_focused(true);
		Animated.spring(
			anim_cancel,
			{
				toValue: 1, useNativeDriver: false,
				speed: 20, bounciness: 4
			}
		).start();
	};

	const on_cancel = () => { // закрываем поиск
		set_query('');
		set_is_search_focused(false);
		search_ref.current?.blur();
		Animated.spring(
			anim_cancel,
			{
				toValue: 0, useNativeDriver: false,
				speed: 20, bounciness: 4
			}
		).start();
	};

	const cancel_width = anim_cancel.interpolate({
		inputRange: [0, 1], outputRange: [0, 72]
	});
	const cancel_opacity = anim_cancel.interpolate({
		inputRange: [0, 0.5, 1], outputRange: [0, 0, 1]
	});

	return (
		<View style={sx.search_row}>
			<View style={sx.search_blur}>
				<Ionicons
					name='search' size={16}
					color={Colors.dark.onSurfaceVariant}
					style={{ marginLeft: 10 }}
				/>
				<TextInput
					ref={search_ref}
					style={sx.search_input}
					placeholder='search'
					placeholderTextColor={Colors.dark.onSurfaceVariant}
					value={query} onChangeText={set_query}
					onFocus={on_focus}
					onBlur={() => !query && on_cancel()}
					returnKeyType='search'
					clearButtonMode='never'
					selectionColor={Colors.dark.primary}
				/>
			</View>
			<Animated.View
				style={{
					width: cancel_width,
					opacity: cancel_opacity,
					overflow: 'hidden'
				}}
			>
				<Pressable onPress={on_cancel} style={sx.cancel_btn}>
					<Text style={sx.cancel_text}>cancel</Text>
				</Pressable>
			</Animated.View>
		</View>
	);
}
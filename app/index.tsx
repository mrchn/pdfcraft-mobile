// @/app/index
import React, {useState, useRef} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {Ionicons} from '@expo/vector-icons';
import {DocumentList} from '@/app/ui/list';
import {useAppTheme, home as theme} from '@/app/ui/theme';

export default function HomeScreen() {
	const sx = useAppTheme(theme);
	const [query, set_query] = useState('');
	const [has_docs, set_has_docs] = useState(false);
	const [is_search_focused, set_is_search_focused] = useState(false);
	const search_ref = useRef<TextInput>(null);

	const on_focus = () => {
		set_is_search_focused(true);
	};

	const on_cancel = () => {
		set_query('');
		set_is_search_focused(false);
		search_ref.current?.blur();
	};

	return (
	<View style={[sx.root, {paddingTop: useSafeAreaInsets().top}]}>
		<View style={sx.header}>
			<Text style={sx.title}>Ready to craft</Text>
		</View>
		{has_docs && (
		<Animated.View
			entering={FadeIn.duration(250)}
			exiting={FadeOut.duration(200)}>
			<View style={sx.search_row}>
			<View style={sx.search}>
				<Ionicons
					name='search' size={16}
					color={sx.title.color}
					style={{ marginLeft: 20 }}
				/>
				<TextInput
					ref={search_ref} style={sx.search_input}
					placeholder='search for templates...'
					onFocus={on_focus}
					placeholderTextColor={sx.title.color}
					value={query} onChangeText={set_query}
					onBlur={() => !query && on_cancel()}
					returnKeyType='search' clearButtonMode='never'
					selectionColor={sx.cancel_text.color}
				/>
			</View>
			<View
				style={{
					width: is_search_focused ? 72 : 0,
					opacity: is_search_focused ? 1 : 0,
					overflow: 'hidden'
				}}
			>
				<Pressable onPress={on_cancel} style={sx.cancel_btn}>
					<Text style={sx.cancel_text}>cancel</Text>
				</Pressable>
			</View>
		</View>
		</Animated.View>
		)}
		<DocumentList
			query={query}
			on_count_change={(count) => set_has_docs(count > 0)}/>
	</View>
	)
}
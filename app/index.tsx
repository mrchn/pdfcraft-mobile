// @/app/index

import React, { useState, useEffect, useCallback } from 'react'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as FileSystem from 'expo-file-system/legacy'
import { useTranslation } from 'react-i18next'
import { Ionicons } from '@expo/vector-icons'
import Animated, {
	FadeIn, FadeOut, FadeInDown,
	LinearTransition } from 'react-native-reanimated'
import {
	FlatList, Pressable, View, Text, TextInput, Alert,
	ActivityIndicator } from 'react-native'

import { Create, Parse } from '@/craft'
import { useAppTheme, home as theme } from '@/theme'
import { Form, Doc, Picker, hapticTap } from '@/components'

const DB_URI = `${FileSystem.documentDirectory}doc_db.json`

export default function HomeScreen() {
	const {t} = useTranslation()
	const sx = useAppTheme(theme)

	const [query, set_query] = useState('')
	const [is_loaded, set_is_loaded] = useState(false)
	const [docs, setDocs] = useState<Doc[]>([])
	const [form_visible, set_form_visible] = useState(false)
	const [is_converting, set_is_converting] = useState(false)
	const has_docs = docs.length > 0

	const [
		detected_fields, set_detected_fields
	] = useState<string[]>([])
	const [
		picked_doc, set_picked_doc
	] = useState<{ uri: string; title: string } | null>(null)

	const create = async (data: Record<string, string>) => {
		if (!picked_doc) { return }
		set_form_visible(false);
		set_is_converting(true);
		try { await Create({doc: picked_doc, data: data })
		} catch {} finally {
			set_is_converting(false);
			set_picked_doc(null)
		}
	}

	useEffect(() => { (async () => {
		try {
			if ((await FileSystem.getInfoAsync(DB_URI)).exists) {
				const saved = JSON.parse(
					await FileSystem.readAsStringAsync(DB_URI)
				);
				if (Array.isArray(saved)) setDocs(saved)
			}
		} catch {} finally { set_is_loaded(true) }
	})()}, []);

	useEffect(() => { if (is_loaded) {
		FileSystem.writeAsStringAsync(
			DB_URI, JSON.stringify(docs)
		).catch(() => {})
	}}, [docs, is_loaded]);

	const handle_delete_document = useCallback((id: string) => {
		hapticTap();
		setDocs(
			(prev_docs) => prev_docs.filter(
				(doc) => doc.id !== id
				)
		)
	}, []);

	const { pick, isLoading: is_picking } = Picker({docs, setDocs});

	const filtered = docs.filter(
		(d) => d.title.toLowerCase().includes(
			query.toLowerCase()
			)
		);

	const render_right_actions = useCallback((id: string) => (
		<Pressable
			style={sx.swipeDelete}
			onPress={() => handle_delete_document(id)}>
			<Ionicons name='trash' size={22} color='#FFF'/>
		</Pressable>
	), [sx, handle_delete_document]);

	const render_item = useCallback(({ item }: { item: Doc }) => (
		<Animated.View
			entering={FadeInDown.duration(300).springify()}
			layout={LinearTransition.springify()}
			style={{
				borderRadius: 24,
				overflow: 'hidden',
				marginBottom: 8
			}}
		>
		<Swipeable
			renderRightActions={() => render_right_actions(item.id)}
			friction={2} rightThreshold={40}>
			<Pressable
				style={[sx.row]}
				onPress={async () => {
					hapticTap();
					const uri = item.uri;
					const title = item.title;
					set_picked_doc({ uri, title });
					try {
						const fields = await Parse(uri);
						set_detected_fields(fields);
						set_form_visible(true);
					} catch { set_picked_doc(null) }
				}}
			>
				<View
					style={[
						sx.icon_wrap,
						{backgroundColor: item.color + '22'}
					]}>
					<Ionicons
						name={item.icon as any}
						size={22} color={item.color}/>
				</View>
				<View style={{flex: 1}}>
					<Text
						style={sx.row_title}
						numberOfLines={1}>
						{item.title}
					</Text>
					<Text style={sx.row_sub}>
						{item.size} · {item.date}
					</Text>
				</View>
				<Ionicons
					name='chevron-forward' size={16}
					color={sx.title.color} 
					style={{marginLeft: 8}}/>
			</Pressable>
		</Swipeable>
		</Animated.View>
	), [sx, render_right_actions]);

	const insets = useSafeAreaInsets();

	return (
	<View style={[sx.root, {paddingTop: insets.top}]}>
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
						style={{marginLeft: 20}}
					/>
					<TextInput
						style={sx.search_input}
						placeholder={t('search')}
						placeholderTextColor={sx.title.color}
						value={query} onChangeText={set_query}
						returnKeyType='search' clearButtonMode='never'
						selectionColor={sx.title.color}
					/>
				</View>
			</View>
		</Animated.View>
		)}
		<View style={{flex: 1}}>
			<FlatList
				data={filtered} keyExtractor={(d) => d.id}
				renderItem={render_item}
				contentContainerStyle={sx.list_content}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={
					filtered.length > 0 ? (
						<Animated.View
							entering={FadeIn.duration(250)}
							exiting={FadeOut.duration(200)}
							style={{marginBottom: 8}}>
							<Text style={sx.section_label}>
								{filtered.length}{' '}
								{filtered.length ===
								1 ? 'DOCUMENT' : 'DOCUMENTS'}
							</Text>
						</Animated.View>
					) : null
				}
				ListEmptyComponent={
					<View style={sx.empty}>
						<Ionicons
							name='folder-open-outline' size={48}
							color={sx.section_label.color}/>
						<Text style={sx.empty_text}>
							{t('docsNotFound')}
						</Text>
					</View>
				}
			/>
			<Pressable
				style={({ pressed }) => [
					sx.fab, { transform: [{ scale:pressed?0.92:1 }]}
				]}
				onPress={ pick }
				disabled={ is_converting || is_picking }>
				{ is_converting || is_picking
				? <ActivityIndicator color={sx.title.color}/>
				: <Ionicons
					name='add' size={32}
					color={sx.title.color}/>
				}
				</Pressable>
			<Form
				visible={form_visible} fields={detected_fields}
				on_close={() => set_form_visible(false)}
				on_submit={create}/>
		</View>
	</View>
	)
}
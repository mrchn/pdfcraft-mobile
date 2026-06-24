// @/app/index

import React, { useState, useEffect, useCallback } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import Animated, {
	FadeIn, FadeOut, FadeInDown,
	LinearTransition } from 'react-native-reanimated';
import {
	FlatList, Pressable, View, Text, TextInput, Alert,
	ActivityIndicator, Settings } from 'react-native';

import { Create, Parse } from '@/services';
import { Form, Doc, hapticTap } from '@/components';
import { useAppTheme, home as theme } from '@/theme';

const serverUrl = Settings.get('server_url')
	? Settings.get('server_url')
	: 'https://pdfcraft-mobile-backend.onrender.com';

export default function HomeScreen() {

	const {t} = useTranslation();
	const sx = useAppTheme(theme);

	const [query, set_query] = useState('');
	const [is_loaded, set_is_loaded] = useState(false);
	const [documents, set_documents] = useState<Doc[]>([]);
	const [form_visible, set_form_visible] = useState(false);
	const [is_converting, set_is_converting] = useState(false);
	const has_docs = documents.length > 0;

	const [
		detected_fields, set_detected_fields
	] = useState<string[]>([]);
	const [
		picked_doc, set_picked_doc
	] = useState<{ uri: string; title: string } | null>(null);

	const create = async (data: Record<string, string>) => {

		if (!picked_doc) { return }
		set_form_visible(false);
		set_is_converting(true);

		try {
			await Create({
				doc: picked_doc,
				data: data,
				url: serverUrl,
				t: t
			})
		} catch {
			Alert.alert(
				`${ t('serverIsWakingUp' )}`,
				`${ t('serverWait') }`,
				[{ text: 'OK' }]
			)
		} finally {
			set_is_converting(false);
			set_picked_doc(null);
		}
	};

	useEffect(() => { // загрузка списка на старте
		const load_documents = async () => {
			try {
				const db_uri = `${FileSystem.documentDirectory}doc_db.json`;
				const info = await FileSystem.getInfoAsync(db_uri);
				if (info.exists) {
					const text_data = await FileSystem.readAsStringAsync(db_uri);
					const saved_docs = JSON.parse(text_data);
					if (Array.isArray(saved_docs)) {
						set_documents(saved_docs)
					}
				}
			} catch {} finally { set_is_loaded(true) }
		}; load_documents()
	}, []);

	useEffect(() => { // авто-save при изменении листа
		if (!is_loaded) return;
		const save_documents = async () => {
			try {
				const db_uri = `${FileSystem.documentDirectory}doc_db.json`;
				const text_data = JSON.stringify(documents);
				await FileSystem.writeAsStringAsync(
					db_uri, text_data
					)
			} catch {}
		}; save_documents()
	}, [documents, is_loaded]);

	// удаление из списка по id
	const handle_delete_document = useCallback((id: string) => {
		hapticTap();
		set_documents(
			(prev_docs) => prev_docs.filter(
				(doc) => doc.id !== id
				)
		)
	}, []);

	// и дальше добавление :>
	const handle_pick_document = async () => {
		try {
			hapticTap();
			const result = await DocumentPicker.getDocumentAsync({
				type: [
					'application/msword', DOCX_MIME,
				], copyToCacheDirectory: true
			});
			if (!result.canceled && result.assets && result.assets[0]) {
				const picked_file = result.assets[0];
				const file_size_bytes = picked_file.size;

				const already_exists = documents.some(
					d => d.title === picked_file.name
					);
				if (already_exists) {
					Alert.alert(
						':(', `${t('docExists')}`,
						[{ text: 'OK' }]
						);
					return
				}

				// default значение для маленьких файлов
				let file_size_mb = '0.1 MB';
				if (file_size_bytes) {
					const size_in_mb = file_size_bytes / (1024 * 1024);
					file_size_mb = size_in_mb < 0.1 
						? `${(file_size_bytes / 1024).toFixed(0)} KB` 
						: `${size_in_mb.toFixed(1)} MB`;
				}

				// создаем новый док в список
				const new_doc: Doc = {
					id: Date.now().toString(),
					title: picked_file.name,
					size: file_size_mb,
					date:
						'Today, '
						+ new Date().toLocaleTimeString(
							[], {
								hour: '2-digit',
								minute: '2-digit'
							}),
					icon: 'document-text',
					color: '#1F4E79',
					uri: picked_file.uri
				};

				hapticTap();
				set_documents(
					(prev_docs) => [new_doc, ...prev_docs]
					)
			}
		} catch {}
	};

	const filtered = documents.filter(
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

	// рендер карточек в списке
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
					set_picked_doc({
						uri: item.uri, title: item.title
					});
					const fields=await Parse(item.uri);
					set_detected_fields(fields);
					set_form_visible(true);
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
			{!is_converting && (
				<Pressable
					style={({ pressed }) => [
					sx.fab,
					{ transform: [{
						scale:pressed?0.92:1
					}]}]}
					onPress={handle_pick_document}>
					<Ionicons
						name='add' size={32}
						color={sx.title.color}/>
				</Pressable>
			)}
			<Form
				visible={form_visible} fields={detected_fields}
				on_close={() => set_form_visible(false)}
				on_submit={create}/>
			{is_converting && (
				<View style={sx.indicator}>
					<ActivityIndicator
						size='large' color={sx.title.color}/>
					<Text style={sx.indicator_text}>
						crafting
					</Text>
				</View>
			)}
		</View>
	</View>
	)
}
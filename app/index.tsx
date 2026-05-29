// @/app/index (pdfcraft-mobile)

// REACT AND EXPO COMPONENTS
import React, { useState, useEffect, useCallback } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import Animated, {
	FadeIn, FadeOut, FadeInDown,
	LinearTransition } from 'react-native-reanimated';
import {
	FlatList, Pressable, View, Text, TextInput, Alert,
	ActivityIndicator, Settings } from 'react-native';

// PROJECT COMPONENTS
import * as pdfcraft from '@/app/pdfcraft';
import { ClientForm } from '@/app/form';
import { useAppTheme, home as theme } from '@/app/theme';

const serverUrl = Settings.get('server_url')
	? Settings.get('server_url')
	: 'https://pdfcraft-mobile-backend.onrender.com';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export interface Doc {
	id: string; title: string; size: string;
	date: string; icon: string; color: string; uri: string
}

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
		selected_doc, set_selected_doc
	] = useState<{ uri: string; title: string } | null>(null);

	// КРАФТИМ ДОКУМЕНТ
	const handle_create_contract = async (
		form_data: Record<string, string>
	) => {

		if (!selected_doc) { return }
		set_form_visible(false);
		setTimeout(async () => {

			const generated_uri = await pdfcraft.gen_docx(
				selected_doc.uri, form_data, selected_doc.title
				);

			if (generated_uri) {
				const docx_title = generated_uri.split('/').pop()
					|| `crafted_${selected_doc.title}`;
				const pdf_title = docx_title.replace('.docx', '.pdf');
				set_is_converting(true);

				try {

					const formData = new FormData();
					formData.append('file', {
						uri: generated_uri,
						name: docx_title,
						type: DOCX_MIME,
					} as any);

					const response = await fetch(
						`${serverUrl}/convert`, {
							method: 'POST', body: formData,
							headers: { 'Accept': 'application/pdf' }
						});
					const contentType = response.headers.get(
						'content-type'
						);

					if (!response.ok) { // ошибка сервера
						const errorText = await response.text();
						Alert.alert(
							`${t('serverError')}`,
							errorText, [{ text: 'OK' }]
							);
						return
					}

					if ( // если сервер прислал не pdf
						contentType && !contentType.includes(
							'application/pdf'
							)
						) {
						const rawText = await response.text();
						Alert.alert(
							`${t('serverResponse')}`,
							rawText, [{ text: 'OK' }]
							);
						return
					}

					const arrayBuffer = await response.arrayBuffer();
					const uint8 = new Uint8Array(arrayBuffer);
					const chunks: string[] = [];
					for (let i = 0; i < uint8.length; i += 1024) {
						chunks.push(
							String.fromCharCode.apply(
								null,
								uint8.subarray(i, i + 1024)
								)
							)
					}
					const base64_data = btoa(chunks.join(''));
					const pdf_uri = `${FileSystem.documentDirectory}${pdf_title}`;

					await FileSystem.writeAsStringAsync(
						pdf_uri, base64_data,
						{ encoding: FileSystem.EncodingType.Base64 }
						);

					if (await Sharing.isAvailableAsync()) {
						await Sharing.shareAsync(pdf_uri)
					};

					// чистим temp .docx
					await FileSystem.deleteAsync(
						generated_uri, { idempotent: true }
						)

				} catch {
					// если сервер не проснулся
					set_is_converting(false);
					Alert.alert(
						`${t('serverIsWakingUp')}`,
						`${t('serverWait')}`,
						[{ text: 'OK' }]
						)
				} finally { set_selected_doc(null) }

			} else {
				// если ошибка в pdfcraft
				Alert.alert(
					':(', `${t('craftError')}`,
					[{ text: 'OK' }]
					)
			}
		}, 600)
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
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		set_documents(
			(prev_docs) => prev_docs.filter(
				(doc) => doc.id !== id
				)
		)
	}, []);

	// и дальше добавление :>
	const handle_pick_document = async () => {
		try {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

				Haptics.impactAsync(
					Haptics.ImpactFeedbackStyle.Light
					);
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
					Haptics.impactAsync(
						Haptics.ImpactFeedbackStyle.Light
					);
					set_selected_doc({
						uri: item.uri, title: item.title
					});
					const fields=await pdfcraft.parse_docx(item.uri);
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
				<View style={sx.row_meta}>
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
						selectionColor={sx.cancel_text.color}
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
							style={sx.list_header}>
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
				<View>
					<Pressable
						style={({ pressed }) => [
							sx.fab,
							{transform:[{scale:pressed?0.92:1}]}]}
						onPress={handle_pick_document}>
						<Ionicons
							name='add' size={32}
							color={sx.title.color}/>
					</Pressable>
				</View>
			)}
			<ClientForm
				visible={form_visible} fields={detected_fields}
				on_close={() => set_form_visible(false)}
				on_submit={handle_create_contract}/>
			{is_converting && (
				<View
					style={{
						position: 'absolute', top: 0, left: 0,
						right: 0, bottom: 0, justifyContent: 'center',
						backgroundColor: 'rgba(0,0,0,0.6)',
						alignItems: 'center', zIndex: 9999,
						elevation: 9999 }}>
					<ActivityIndicator
						size='large' color={sx.title.color}/>
					<Text
						style={{
							color: sx.title.color,
							marginTop: 16,
							fontFamily: 'ui-monospace' }}>
						crafting
					</Text>
				</View>
			)}
		</View>
	</View>
	)
}
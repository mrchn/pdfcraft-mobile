// @/app/ui/list

import React, {useState, useEffect, useCallback} from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, {
	FadeIn, FadeOut,
	FadeInDown, LinearTransition } from 'react-native-reanimated';
import {
	FlatList, Pressable, View, Text, Alert,
	ActivityIndicator, useColorScheme } from 'react-native';

// expo components
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';

// project components
import * as pdfcraft from '@/app/pdfcraft';
import { ClientForm } from '@/app/ui/form';
import { home as theme } from '@/app/ui/theme';

// interfaces
export interface Doc {
	id: string; title: string; size: string;
	date: string; icon: string; color: string;
	uri: string;
}
interface DocumentListProps {
	query: string; on_count_change: (count: number) => void
}

export const DocumentList = ({
	query, on_count_change }: DocumentListProps) => {

	// dynamic theme
	const system_scheme = useColorScheme();
	const theme_mode:ThemeType=system_scheme==='dark'?'dark':'light';
	const sx = theme(theme_mode);

	const [documents, set_documents] = useState<Doc[]>([]);
	const [form_visible, set_form_visible] = useState(false);
	const [
		detected_fields, set_detected_fields
	] = useState<string[]>([]);
	const [
		selected_doc, set_selected_doc
	] = useState<{ uri: string; title: string } | null>(null);
	const [is_loaded, set_is_loaded] = useState(false);
	const [is_converting, set_is_converting] = useState(false);

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
				const docx_title = generated_uri.split('/').pop() || `crafted_${selected_doc.title}`;
				const pdf_title = docx_title.replace('.docx', '.pdf');
				set_is_converting(true);
				try {
					const formData = new FormData();
					formData.append('file', {
						uri: generated_uri, name: docx_title,
						type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					} as any);
					const response = await fetch('https://pdfcraft-mobile-backend.onrender.com/convert', {
						method: 'POST', body: formData, headers: { 'Accept': 'application/pdf' },
					});
					const contentType = response.headers.get('content-type');
					if (!response.ok) {
						const errorText = await response.text();
						console.log('PDFCRAFT | server error: ', errorText);
						throw new Error(`server error: ${response.status}`);
					}
					if (contentType && !contentType.includes('application/pdf')) {
						const rawText = await response.text();
						Alert.alert('SERVER RESPONSE', rawText, [{ text: 'OK' }]);
						return;
					}
					const arrayBuffer = await response.arrayBuffer();
					const uint8 = new Uint8Array(arrayBuffer); const chunks: string[] = [];
					for (let i = 0; i < uint8.length; i += 1024) {
						chunks.push(String.fromCharCode.apply(null, uint8.subarray(i, i + 1024)));
					}
					const base64_data = btoa(chunks.join(''));
					const pdf_uri = `${FileSystem.documentDirectory}${pdf_title}`;
					await FileSystem.writeAsStringAsync(pdf_uri, base64_data, { encoding: FileSystem.EncodingType.Base64 });
					set_is_converting(false);
					if (await Sharing.isAvailableAsync()) { await Sharing.shareAsync(pdf_uri) };
				} catch {
					Alert.alert('SERVER IS WAKING UP', 'wait about 40 seconds and press the button again.', [{ text: 'OK' }])
				}
			} else { Alert.alert(':(', 'something went wrong while building.', [{ text: 'OK' }]) }
			set_selected_doc(null);
		}, 600);
	};
	useEffect(() => { // загрузка списка при старте app
		const load_documents = async () => {
			try {
				const db_uri = `${FileSystem.documentDirectory}doc_db.json`;
				const info = await FileSystem.getInfoAsync(db_uri);
				if (info.exists) {
					const text_data = await FileSystem.readAsStringAsync(db_uri);
					const saved_docs = JSON.parse(text_data);
					if (Array.isArray(saved_docs)) { set_documents(saved_docs); }
				}
			} catch (e) { console.log('error loading saved documents:', e); }
			finally { set_is_loaded(true) }
		}; load_documents();
	}, []);

	useEffect(() => { // авто сохранение при изменении списка
		if (!is_loaded) return;
		const save_documents = async () => {
			try {
				const db_uri = `${FileSystem.documentDirectory}doc_db.json`;
				const text_data = JSON.stringify(documents);
				await FileSystem.writeAsStringAsync(db_uri, text_data);
			} catch (e) { console.log('error saving documents:', e); }
		}; // сохраняем только если приложение уже загрузилось (чтобы не затереть пустой массив на старте)
		save_documents();
	}, [documents, is_loaded]);

	// удаление из списка по id
	const handle_delete_document = (id: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		set_documents((prev_docs) => prev_docs.filter((doc) => doc.id !== id));
	};

	// и дальше добавление :>
	const handle_pick_document = async () => {
		try {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
			const result = await DocumentPicker.getDocumentAsync({
				type: [
					'application/msword',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				], copyToCacheDirectory: true,
			});
			if (!result.canceled && result.assets && result.assets[0]) {
				const picked_file = result.assets[0];
				const file_size_bytes = picked_file.size;
				const already_exists = documents.some(d => d.title === picked_file.name);
				if (already_exists) {
					Alert.alert(':(', 'document already exists.', [{ text: 'OK' }])
					return;
				}
				let file_size_mb = '0.1 MB'; // default значение для маленьких файлов
				if (file_size_bytes) {
					const size_in_mb = file_size_bytes / (1024 * 1024);
					file_size_mb = size_in_mb < 0.1 
						? `${(file_size_bytes / 1024).toFixed(0)} KB` 
						: `${size_in_mb.toFixed(1)} MB`;
				}
				const new_doc: Doc = {
					id: Date.now().toString(), title: picked_file.name, size: file_size_mb,
					date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
					icon: 'document-text', color: '#1F4E79', uri: picked_file.uri
				};
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				set_documents((prev_docs) => [new_doc, ...prev_docs]);
			}
		} catch (error) { console.log('error picking document:', error); }
	};
	const filtered = documents.filter((d) => d.title.toLowerCase().includes(query.toLowerCase()));
	useEffect(() => { on_count_change(documents.length) }, [documents]);

	const render_right_actions = useCallback((id: string) => (
		<Pressable
			style={sx.swipeDelete}
			onPress={() => handle_delete_document(id)}>
			<Ionicons name='trash' size={22} color='#FFF' />
		</Pressable>
	), []);

	// рендер карточек в списке
	const render_item = useCallback(
		({ item, index }: { item: Doc; index: number }) =>
	(
		<Animated.View
			entering={FadeInDown.duration(300).springify()}
			layout={LinearTransition.springify()}
			style={{
				borderRadius: 24,
				overflow: 'hidden', marginBottom: 8
			}}
		>
		<Swipeable
			renderRightActions={() => render_right_actions(item.id)}
			friction={2} rightThreshold={40}>
			<Pressable
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
				style={[sx.row]}
			>
				<View style={[sx.icon_wrap, { backgroundColor: item.color + '22' }]}>
					<Ionicons name={item.icon as any} size={22} color={item.color}/>
				</View>
				<View style={sx.row_meta}>
					<Text style={sx.row_title} numberOfLines={1}>{item.title}</Text>
					<Text style={sx.row_sub}>{item.size} · {item.date}</Text>
				</View>
				<Ionicons
					name='chevron-forward' size={16}
					color={theme_mode === 'light' ? '#C4C4C6' : '#3A3A3C'} 
					style={{ marginLeft: 8 }}/>
			</Pressable>
		</Swipeable>
		</Animated.View>
	), [sx, render_right_actions]);

	return (
	<GestureHandlerRootView style={{ flex: 1 }}>
		<FlatList
			data={filtered} keyExtractor={(d) => d.id} renderItem={render_item}
			contentContainerStyle={sx.list_content} showsVerticalScrollIndicator={false}
			ListHeaderComponent={
				filtered.length > 0 ? (
					<Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(200)} style={sx.list_header}>
						<Text style={sx.section_label}>
							{filtered.length} {filtered.length === 1 ? 'DOCUMENT' : 'DOCUMENTS'}
						</Text>
					</Animated.View>
				) : null
			}
			style={sx.list}
			ListEmptyComponent={
				<View style={sx.empty}>
					<Ionicons name='folder-open-outline' size={48} color={sx.section_label.color}/>
					<Text style={sx.empty_text}>no documents found</Text>
				</View>
			}
		/>
		{!is_converting && (
			<View style={sx.fab_wrap}>
				<Pressable
					onPress={handle_pick_document}
					style={({ pressed }) => [
						sx.fab,
						{ transform: [{ scale: pressed ? 0.92 : 1 }] }
					]}>
					<Ionicons name='add' size={32} color={sx.title.color}/>
				</Pressable>
			</View>
		)}
		<ClientForm
			visible={form_visible} on_close={() => set_form_visible(false)}
			fields={detected_fields} on_submit={handle_create_contract}/>
		{is_converting && (
			<View
				style={{
					position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
					backgroundColor: 'rgba(0,0,0,0.6)',
					justifyContent: 'center', alignItems: 'center', zIndex: 9999, elevation: 9999, }}>
				<ActivityIndicator size='large' color={sx.title.color} />
				<Text style={{ color: sx.title.color, marginTop: 16, fontFamily: 'ui-monospace' }}>crafting</Text>
			</View>
		)}
	</GestureHandlerRootView>
	)
}

export default function Route() { return null }
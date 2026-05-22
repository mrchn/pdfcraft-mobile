// @/components/ui/list (pdfcraft-mobile)
import React, { useState, useEffect } from 'react'; import { Ionicons } from '@expo/vector-icons';
import { FlatList, Pressable, View, Text } from 'react-native'; import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, LinearTransition, FadeIn, FadeOut } from 'react-native-reanimated';
import * as DocumentPicker from 'expo-document-picker'; import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as FileSystem from 'expo-file-system/legacy'; import * as Sharing from 'expo-sharing';
// project components
import * as pdfcraft from '@/components/pdfcraft'; import { ClientForm } from '@/components/ui/form';
import { theme_homescreen as theme, Colors, Shape } from '@/components/theme';
// interfaces
export interface Doc { id: string; title: string; size: string; date: string; icon: string; color: string; uri: string; }
interface DocumentListProps { query: string; on_count_change: (count: number) => void; is_menu_open: boolean }

export const DocumentList = ({ query, on_count_change, is_menu_open }: DocumentListProps) => {
	const [documents, set_documents] = useState<Doc[]>([]);
	const [form_visible, set_form_visible] = useState(false);
	const [detected_fields, set_detected_fields] = useState<string[]>([]);
	const [selected_doc, set_selected_doc] = useState<{ uri: string; title: string } | null>(null);
	const [is_loaded, set_is_loaded] = useState(false);

	const handle_create_contract = async (form_data: Record<string, string>) => {
		if (!selected_doc) { return }
		set_form_visible(false);
		setTimeout(async () => {
			const generated_uri = await pdfcraft.generate_docx(selected_doc.uri, form_data, selected_doc.title);
			if (generated_uri) {
				const docx_title = generated_uri.split('/').pop() || `crafted_${selected_doc.title}`;
				const pdf_title = docx_title.replace('.docx', '.pdf');
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
						const rawText = await response.text(); alert(`server response: ${rawText}`); return;
					}
					const arrayBuffer = await response.arrayBuffer();
					const uint8 = new Uint8Array(arrayBuffer); const chunks: string[] = [];
					for (let i = 0; i < uint8.length; i += 8192) {
						chunks.push(String.fromCharCode.apply(null, uint8.subarray(i, i + 8192)));
					}
					const base64_data = btoa(chunks.join(''));
					const pdf_uri = `${FileSystem.documentDirectory}${pdf_title}`;
					await FileSystem.writeAsStringAsync(pdf_uri, base64_data, {
						encoding: FileSystem.EncodingType.Base64,
					});
					if (await Sharing.isAvailableAsync()) { await Sharing.shareAsync(pdf_uri) }
				} catch (error) { alert('server is waking up, wait about 40 seconds and press the button again.') }
			} else { alert('something went wrong while building :(') }
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
	}; // и дальше добавление :>
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
	// рендерим header (кол-во файлов)
	const render_right_actions = (id: string) => { // удаление по свайпу
		return (
		<Pressable
				android_ripple={{ color: 'rgba(255,255,255,0.2)' }} onPress={() => handle_delete_document(id)}
				style={{
					backgroundColor: Colors.dark.error, justifyContent: 'center',
					alignItems: 'center', width: 80, height: '100%',
				}}
		>
			<Ionicons name='trash' size={22} color='#FFF' />
		</Pressable>
		);
	};
	// рендерим файлы в списке
	const render_item = ({ item, index }: { item: Doc; index: number }) => (
	<Animated.View
		entering={FadeInDown.duration(300).springify()} layout={LinearTransition.springify()}
		style={{ borderRadius: Shape.large, overflow: 'hidden', marginBottom: 12 }}
	>
	<Swipeable
		renderRightActions={() => render_right_actions(item.id)}
		friction={2} rightThreshold={40}>
		<Pressable
			onPress={async () => {
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				set_selected_doc({ uri: item.uri, title: item.title });
				const fields = await pdfcraft.parse_docx_templates(item.uri);
				set_detected_fields(fields); set_form_visible(true);
			}}
			android_ripple={{ color: Colors.dark.onSurface + '1A' }}
			style={[theme.row]}
		>
			<View style={[theme.icon_wrap, { backgroundColor: item.color + '22' }]}>
				<Ionicons name={item.icon as any} size={22} color={item.color}/>
			</View>
			<View style={theme.row_meta}>
				<Text style={theme.row_title} numberOfLines={1}>{item.title}</Text>
				<Text style={theme.row_sub}>{item.size} · {item.date}</Text>
			</View>
		</Pressable>
	</Swipeable>
	</Animated.View>
	);
	return (
	<GestureHandlerRootView style={{ flex: 1 }}>
		<FlatList
			data={filtered} keyExtractor={(d) => d.id} renderItem={render_item}
			contentContainerStyle={theme.list_content} showsVerticalScrollIndicator={false}
			ListHeaderComponent={
				filtered.length > 0 ? (
					<Animated.View entering={FadeIn.duration(250)} exiting={FadeOut.duration(200)} style={theme.list_header}>
						<Text style={theme.section_label}>
							{filtered.length} {filtered.length === 1 ? 'document' : 'documents'}
							{is_menu_open && ' (docx files)'}
						</Text>
					</Animated.View>
				) : null
			}
			style={theme.list}
			ListEmptyComponent={
				<View style={theme.empty}>
					<Ionicons name='folder-open-outline' size={48} color={Colors.dark.onSurfaceVariant}/>
					<Text style={theme.empty_text}>no documents found</Text>
				</View>
			}
		/>
		<View style={theme.fab_wrap}>
			<Pressable
				onPress={handle_pick_document}
				style={({ pressed }) => [
					theme.fab,
					{ transform: [{ scale: pressed ? 0.92 : 1 }] }
				]}
				android_ripple={{ color: Colors.dark.onPrimary + '33', borderless: true }}>
				<Ionicons name='add' size={32} color={Colors.dark.onPrimaryContainer}/>
			</Pressable>
		</View>
		<ClientForm
			visible={form_visible} on_close={() => set_form_visible(false)}
			fields={detected_fields} on_submit={handle_create_contract}/>
	</GestureHandlerRootView>
	)
}
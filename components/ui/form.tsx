// @/components/ui/form (pdfcraft-mobile)
import React, { useState, useEffect } from 'react'; import { Ionicons } from '@expo/vector-icons';
import { Modal, View, Text, TextInput, ScrollView, Platform } from 'react-native';
import { TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { theme_form as theme } from '@/components/theme';

interface ClientFormProps {
	visible: boolean; on_close: () => void; fields: string[]; on_submit: (data: Record<string, string>) => void
}

export const ClientForm = ({ visible, on_close, fields = [], on_submit }: ClientFormProps) => {
	const [form_data, set_form_data] = useState<Record<string, string>>({});
	useEffect(() => {
		const initial: Record<string, string> = {}; fields.forEach(f => { initial[f] = ''; }); set_form_data(initial);
	}, [fields]);
	const handle_submit = () => { on_submit(form_data); on_close() };
	return (
	<Modal visible={visible} animationType='slide' presentationStyle='pageSheet'>
		<KeyboardAvoidingView 
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  style={{ flex: 1, backgroundColor: '#1C1C1E' }}
		>
			<View style={theme.header}>
				<Text style={theme.title}></Text>
				<TouchableOpacity onPress={on_close}><Ionicons name='close' size={24} color='#FFF'/></TouchableOpacity>
			</View>
			<ScrollView contentContainerStyle={theme.scroll_content}>
				<Text style={theme.section_title}>document variables</Text>
				{fields.length > 0 ? (
					fields.map((field) => (
						<TextInput
							key={field} style={theme.input} placeholder={field}
							placeholderTextColor='#636366' value={form_data[field] || ''}
							onChangeText={(text) => set_form_data(prev => ({ ...prev, [field]: text }))}/>
					))
				) : (
				<Text style={{ color: '#FF453A', marginTop: 10, textAlign: 'center' }}>fields is empty</Text>
				)}
				<TouchableOpacity style={theme.submit_btn} onPress={handle_submit}>
					<Text style={theme.submit_text}>Generate Document</Text>
				</TouchableOpacity>
			</ScrollView>
		</KeyboardAvoidingView>
	</Modal>
	)
}
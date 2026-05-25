// @/app/ui/form

import React, { useState, useEffect } from 'react';
import {Ionicons} from '@expo/vector-icons';
import {form as theme} from '@/app/ui/theme';
import {
	TextInput, ScrollView,
	Modal, View, Text, Platform, TouchableOpacity,
	KeyboardAvoidingView, useColorScheme
} from 'react-native';

interface ClientFormProps {
	visible: boolean; on_close: () => void; fields: string[];
	on_submit: (data: Record<string, string>) => void
}

export const ClientForm = ({
		visible, on_close, fields = [], on_submit
	}: ClientFormProps) => {

	// dynamic theme
	const system_scheme = useColorScheme();
	const theme_mode:ThemeType=system_scheme==='dark'?'dark':'light';
	const sx = theme(theme_mode);

	const [ // стейты полей в форме
		form_data, set_form_data
	] = useState<Record<string, string>>({});

	useEffect(() => {
		const initial: Record<string, string> = {};
		fields.forEach(f => { initial[f] = ''; });
		set_form_data(initial);
	}, [fields]);

	const handle_submit = () => {
		on_submit(form_data); on_close()
	};

	return (
		<Modal
			visible={visible} animationType='slide'
			presentationStyle='pageSheet'
		>
			<KeyboardAvoidingView 
				behavior={
					Platform.OS === 'ios' ? 'padding' : 'height'
				}
				style={sx.safe} keyboardVerticalOffset={16}
			>
				<View style={sx.header}>
					<View style={{ width: 24 }} />
					<Text style={sx.title}></Text>
					<TouchableOpacity onPress={on_close}>
						<Ionicons
							name='close-circle' size={48}
							color={theme_mode === 'light' ? '#8E8E93' : '#48484A'}
						/>
					</TouchableOpacity>
				</View>
				<ScrollView
					contentContainerStyle={sx.scroll_content}
				>
					<Text style={sx.section_title}>
						DOCUMENT VARIABLES
					</Text>
					{fields.length > 0 ? (
						fields.map((field) => (
							<TextInput
								key={field} style={sx.input}
								placeholder={field}
								placeholderTextColor='#636366'
								value={form_data[field] || ''}
								onChangeText={
									(text) => set_form_data(
										prev => ({
											...prev,
											[field]: text
										})
									)}
							/>
						))
					) : (
						<Text style={sx.fields_empty}>
							fields is empty :(
						</Text>
					)}
				</ScrollView>
				<View style={sx.submit_btn_wrap}>
					<TouchableOpacity
						style={sx.submit_btn} onPress={handle_submit}
					>
						<Text style={sx.submit_text}>CRAFT</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	)
}
export default function Route() { return null }
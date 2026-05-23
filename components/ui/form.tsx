// @/components/ui/form (pdfcraft-mobile)

// react components
import React, { useState, useEffect } from 'react';
import { TextInput, ScrollView } from 'react-native';
import { Modal, View, Text, Platform } from 'react-native';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAvoidingView, useColorScheme } from 'react-native';

// expo and project components
import { Ionicons } from '@expo/vector-icons';
import { form as theme, Colors } from '@/components/theme';

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
	const active_colors = Colors[theme_mode] || Colors.dark;

	const [
		form_data,
		set_form_data
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
			visible={visible}
			animationType='slide'
			presentationStyle='pageSheet'
		>
			<KeyboardAvoidingView 
				behavior={
					Platform.OS === 'ios' ? 'padding' : 'height'
				}
				style={{
					flex: 1, backgroundColor: '#1C1C1E'
				}}
				keyboardVerticalOffset={
					Platform.OS === 'ios' ? 16 : 16
				}
			>
				<View style={sx.header}>
					<Text style={sx.title}></Text>
					<TouchableOpacity
						onPress={on_close}
					>
						<Ionicons
							name='close' size={24}
							color='#FFF'
						/>
					</TouchableOpacity>
				</View>
				<ScrollView
					contentContainerStyle={sx.scroll_content}
				>
					<Text style={sx.section_title}>variables</Text>
					{fields.length > 0 ? (
						fields.map((field) => (
							<TextInput
								key={field}
								style={sx.input}
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
						<Text
							style={{
								color: '#FF453A',
								marginTop: 10,
								textAlign: 'center'
							}}
						>
							fields is empty
						</Text>
					)}
				</ScrollView>
				<View
					style={{
						paddingHorizontal: 20,
						paddingBottom: Platform.OS === 'ios'?50:20,
						backgroundColor: '#1C1C1E'
					}}
				>
				<TouchableOpacity
					style={sx.submit_btn}
					onPress={handle_submit}
				>
					<Text style={sx.submit_text}>craft</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	</Modal>
	)
}
// @/components/form (pdfcraft-mobile)

import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
	TextInput, ScrollView, Modal, View, Text, Platform,
	TouchableOpacity, KeyboardAvoidingView } from 'react-native';

import { FormProps } from '@/components';
import { useAppTheme, form as theme } from '@/theme';

export const Form = ({
		visible, on_close, fields = [], on_submit
	}: FormProps) => {

	const {t} = useTranslation();
	const sx = useAppTheme(theme);

	const [
		form_data, set_form_data
	] = useState<Record<string, string>>({});

	useEffect(() => set_form_data({}), [fields]);

	const handle_submit = () => {
		on_submit(form_data); on_close()
	};

	return (
		<Modal
			visible={visible} animationType='slide'
			presentationStyle='pageSheet'
		>
			<KeyboardAvoidingView 
				behavior={'padding'} style={sx.safe}
				keyboardVerticalOffset={16}
			>
				<View style={sx.header}>
					<View style={{ width: 24 }} />
					<Text style={sx.title}></Text>
					<TouchableOpacity onPress={on_close}>
						<Ionicons
							name='close-circle'
							size={sx.closeBtn.size}
							color={sx.closeBtn.color}
						/>
					</TouchableOpacity>
				</View>
				<ScrollView contentContainerStyle={{padding: 20}}>
					<Text style={sx.section_title}>
						{t('documentVariables')}
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
							{t('fieldsEmpty')}
						</Text>
					)}
				</ScrollView>
				<View style={sx.submit_btn_wrap}>
					<TouchableOpacity
						style={sx.submit_btn}
						onPress={handle_submit}
					>
						<Text style={sx.submit_text}>
							{t('craft')}
						</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	)
}
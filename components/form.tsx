// @/components/form
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { FormProps } from '@/types'
import { useAppTheme, form as theme } from '@/theme'
import {
	TextInput, ScrollView, Modal, View, Text,
	TouchableOpacity, KeyboardAvoidingView } from 'react-native'

export const Form = ({
		visible, on_close, fields = [], on_submit
}: FormProps) => {
	const {t} = useTranslation()
	const sx = useAppTheme(theme)
	const [data, setData] = useState<Record<string, string>>({})
	const handle_submit = () => { on_submit(data); on_close() }
	useEffect(() => setData({}), [fields])
	return (
		<Modal
			visible={visible} animationType='slide'
			presentationStyle='pageSheet'>
			<KeyboardAvoidingView
				behavior={'padding'} style={sx.safe}
				keyboardVerticalOffset={16}>
				<View style={sx.header}>
					<View style={{width: 24}}/>
					<TouchableOpacity onPress={on_close}>
						<Ionicons
							name='close-circle' size={sx.closeBtn.size}
							color={sx.closeBtn.color}/>
					</TouchableOpacity>
				</View>
				<ScrollView contentContainerStyle={{padding: 20}}>
					<Text style={sx.section_title}>{t('vars')}</Text>
					{fields.length > 0 ? (
						fields.map((f) => (
							<TextInput
								key={f} style={sx.input}
								placeholder={f} value={data[f] || ''}
								placeholderTextColor='#636366'
								onChangeText={
									(t)=>setData(p=>({...p, [f]: t}))
								}
							/>
						))
					) : (<Text style={sx.empty}>{t('empty')}</Text>)}
				</ScrollView>
				<View style={sx.submit_btn_wrap}>
					<TouchableOpacity
						style={sx.submit_btn} onPress={handle_submit}>
						<Text style={sx.submit_text}>{t('craft')}</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	)
}
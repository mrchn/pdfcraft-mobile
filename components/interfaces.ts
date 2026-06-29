// @/components/interfaces

import React from 'react'

export interface Doc {
	id: string; title: string; size: string
	date: string; icon: string; color: string
	uri: string
}

export interface FormProps {
	visible: boolean; on_close: () => void
	fields: string[];
	on_submit: (data: Record<string, string>) => void
}

export interface PickerProps {
	docs: Doc[]
	setDocs: React.Dispatch<React.SetStateAction<Doc[]>>
}

export type CreateProps = {
	doc: { uri: string ; title: string }
	data: Record<string, string>
}
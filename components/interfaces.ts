// @/components/interfaces (pdfcraft-mobile)

export interface FormProps {
	visible: boolean;
	on_close: () => void;
	fields: string[];
	on_submit: (data: Record<string, string>) => void
}

export interface Doc {
	id: string; title: string;
	size: string; date: string;
	icon: string; color: string;
	uri: string
}
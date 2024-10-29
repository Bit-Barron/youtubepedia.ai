export interface Message {
	type: 'user' | 'bot';
	content: string;
}

export interface ChatData {
	videoUrl: string;
	transcript: string;
	messages: Message[];
}

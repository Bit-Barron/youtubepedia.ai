export type TranscriptWithChats = {
	id: string;
	userId: string;
	videoUrl: string;
	content: string;
	createdAt: Date;
	chats: Chat[];
};

export interface Chat {
	id: string;
	userId: string;
	message: string;
	type: 'QUESTION';
}

export interface User {
	id: string;
	name: string;
	email: string;
}

export interface Message {
	type: 'user' | 'bot';
	content: string;
}

export interface VideoPost {
	chats: Chat[];
	content: string;
	createdAt: Date;
	id: string;
	user: User;
	userId: string;
	videoUrl: string;
}

export interface ChatData {
	videoUrl: string;
	transcript: string;
	messages: Message[];
}

export {};

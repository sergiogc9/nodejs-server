export type PushoverConfig = {
	user: string;
	token: string;
};

export type PushoverMessage = {
	message: string;
	title?: string;
	priority?: number;
	html?: boolean;
};

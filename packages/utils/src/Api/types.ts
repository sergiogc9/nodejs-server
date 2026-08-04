export type ApiError = {
	code: string;
	message?: string;
};

export type RequestInfo = {
	method: string;
	path: string;
	parameters: unknown;
	body: unknown;
	content_type: unknown;
};

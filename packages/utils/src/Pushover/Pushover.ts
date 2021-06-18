import PushoverNotifications from 'pushover-notifications';

type PushoverMessage = {
	message: string;
	title: string;
	html?: number;
};

let __userConfig = {
	user: '',
	token: ''
};

export class Pushover {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private static __instance: any;

	public static send = (msg: PushoverMessage) => {
		if (!Pushover.__instance) {
			Pushover.__instance = new PushoverNotifications(__userConfig);
		}
		Pushover.__instance.send(msg);
	};

	public static setUserConfig = (data: typeof __userConfig) => {
		__userConfig = data;
	};
}

export default Pushover;

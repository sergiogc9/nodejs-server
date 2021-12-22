import os from 'os';
import fs from 'fs';
import path from 'path';
import PushoverNotifications from 'pushover-notifications';
import isEmpty from 'lodash/isEmpty';

import { PushoverMessage } from './types';

let __userConfig = {
	user: '',
	token: ''
};

let availableRequests = 50;

export class Pushover {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private static __instance: any;

	public static isConfigured = () => !isEmpty(__userConfig.user) && !isEmpty(__userConfig.token);

	public static send = (msg: PushoverMessage) => {
		if (!Pushover.isConfigured()) throw new Error('Pushover is not configured!');
		if (!Pushover.__instance) {
			Pushover.__instance = new PushoverNotifications({ ...__userConfig, onerror: () => {} });
			setInterval(() => {
				availableRequests = Math.min(50, availableRequests + 10);
			}, 60000);
		}

		if (!availableRequests) return;

		Pushover.__instance.send(msg);
		availableRequests -= 1;
		if (availableRequests === 0)
			setTimeout(() => {
				const serviceName = Pushover.__getPackageName();
				const pushoverTitle = `🛑 RATE LIMIT → ${serviceName}`;
				let pushoverMessage = `<b>Service:</b> ${serviceName}\n`;
				pushoverMessage += `<b>Server:</b> ${os.hostname()}\n`;
				pushoverMessage += 'There might be some messages lost. See server logs instead.';
				Pushover.__instance.send({
					html: 1,
					message: pushoverMessage,
					priority: 1,
					title: pushoverTitle
				});
			}, 5000);
	};

	public static setUserConfig = (data: typeof __userConfig) => {
		__userConfig = data;
	};

	private static __getPackageName = () => {
		let pkgPath = path.resolve(process.cwd(), '');

		if (!pkgPath.endsWith('package.json')) {
			pkgPath = path.join(pkgPath, 'package.json');
		}

		if (fs.existsSync(pkgPath)) {
			const pkg = JSON.parse(fs.readFileSync(pkgPath).toString());
			return pkg.name;
		}

		return '-';
	};
}

export default Pushover;

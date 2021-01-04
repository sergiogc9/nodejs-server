import { Log } from 'src/providers/Log';

class SSRApiLog extends Log {
	constructor() {
		super();
		this.type = 'ssr';
	}
}

export default new SSRApiLog();

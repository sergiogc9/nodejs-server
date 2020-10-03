import { Log } from 'providers/Log';

class ApiLog extends Log {
	constructor() {
		super();
		this.type = 'api';
	}
}

export default new ApiLog();

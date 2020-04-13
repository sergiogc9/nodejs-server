import { Log } from '@src/providers/Log';

class TemplateApiLog extends Log {
	constructor() {
		super();
		this.type = 'template';
	}
}

export default new TemplateApiLog();

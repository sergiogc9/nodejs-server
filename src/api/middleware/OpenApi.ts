import { Application } from 'express';
import { OpenApiValidator } from 'express-openapi-validator';

import Log from '@src/api/middleware/Log';

class OpenApi {
	static async mount(_express: Application): Promise<Application> {
		Log.info('Booting the \'OpenApi\' middleware...');

		await new OpenApiValidator({
			apiSpec: './src/api/openapi/openapi.yaml',
			validateRequests: true,
			validateResponses: true,
			$refParser: {
				mode: 'dereference'
			}
		}).install(_express);

		return _express;
	}
}

export default OpenApi;

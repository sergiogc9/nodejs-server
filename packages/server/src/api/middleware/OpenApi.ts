import { Application } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'js-yaml';
import JsonRefs from 'json-refs';

import Config from 'src/providers/Config';
import Log from 'src/api/middleware/Log';

function yamlContentProcessor(res: any, callback: any) {
	callback(undefined, YAML.safeLoad(res.text));
}

class OpenApi {
	static async mount(_express: Application): Promise<Application> {
		Log.info("Booting the 'OpenApi' middleware...");

		const { openApiPath } = Config.get();

		if (openApiPath) {
			const rootOpenApiJSON = YAML.load(fs.readFileSync(openApiPath).toString());
			const swaggerDoc = await JsonRefs.resolveRefs(rootOpenApiJSON, {
				location: openApiPath,
				loaderOptions: {
					processContent: yamlContentProcessor
				}
			});

			_express.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc.resolved));

			_express.use(
				OpenApiValidator.middleware({
					apiSpec: openApiPath,
					validateRequests: true,
					validateResponses: true,
					$refParser: {
						mode: 'dereference'
					}
				})
			);
		}

		return _express;
	}
}

export default OpenApi;

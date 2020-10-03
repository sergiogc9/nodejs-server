import { Application } from 'express';
import { OpenApiValidator } from 'express-openapi-validator';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'js-yaml';
import JsonRefs from 'json-refs';

import Log from 'api/middleware/Log';

function yamlContentProcessor(res: any, callback: any) {
	callback(undefined, YAML.safeLoad(res.text));
}

const rootYamlPath = './src/api/openapi/openapi.yaml';

class OpenApi {
	static async mount(_express: Application): Promise<Application> {
		Log.info('Booting the \'OpenApi\' middleware...');

		await new OpenApiValidator({
			apiSpec: rootYamlPath,
			validateRequests: true,
			validateResponses: true,
			$refParser: {
				mode: 'dereference'
			}
		}).install(_express);

		const rootOpenApiJSON = YAML.load(fs.readFileSync(rootYamlPath).toString());
		const swaggerDoc = await JsonRefs.resolveRefs(rootOpenApiJSON, {
			location: rootYamlPath,
			loaderOptions: {
				processContent: yamlContentProcessor
			}
		});

		_express.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc.resolved));

		return _express;
	}
}

export default OpenApi;

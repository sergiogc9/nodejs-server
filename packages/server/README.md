# @sergiogc9/nodejs-server

A modern NodeJS + TypeScript server toolkit built on [Fastify](https://fastify.dev): an API (Zod validation + generated OpenAPI docs, CORS, Helmet, compression, rate limiting, standard response envelope), SSR (EJS), static/SPA serving, optional MongoDB, structured pino logging and graceful shutdown.

TLS/HTTPS, reverse proxy and clustering are intentionally left to infrastructure.

```typescript
import { ApiServer } from '@sergiogc9/nodejs-server';

const server = new ApiServer({
	openApi: { title: 'My API', version: '1.0.0' },
	apiRoutes: async app => {
		app.get('/health', () => ({ status: 'ok' }));
	}
});

await server.start();
```

See the [repository README](../../README.md) for the full overview.

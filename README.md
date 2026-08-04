# NodeJS Server

A small, modern NodeJS + TypeScript server toolkit built on [Fastify](https://fastify.dev). Used across my own projects. It is a monorepo with two published packages:

## [`@sergiogc9/nodejs-server`](./packages/server)

An easy-to-set-up server that enables different services on a single Fastify instance:

- **API** — REST API with Zod-first request/response validation, OpenAPI docs generated from the schemas, CORS, Helmet, compression, rate limiting and a standard response envelope.
- **SSR** — server-side rendered site with EJS views and static public assets.
- **Static** — serve static files / a SPA, with optional HTTP basic auth.
- **MongoDB** (optional), **graceful shutdown** and structured **pino** logging out of the box.

```typescript
import { ApiServer } from '@sergiogc9/nodejs-server';
import { successResponse } from '@sergiogc9/nodejs-utils/Api';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const UserSchema = z.object({ id: z.number(), name: z.string() });

const apiRoutes: FastifyPluginAsync = async fastify => {
	const app = fastify.withTypeProvider<ZodTypeProvider>();
	app.get('/user', { schema: { response: { 200: z.array(UserSchema) } } }, () => [{ id: 1, name: 'Sergio' }]);
	app.post('/user', { schema: { body: UserSchema } }, (request, reply) =>
		successResponse(request, reply, request.body)
	);
};

const server = new ApiServer({
	openApi: { title: 'My API', version: '1.0.0' }, // docs at /api/docs
	apiRoutes
});

await server.start();
```

> TLS/HTTPS, the reverse proxy and clustering are intentionally **not** part of this library — they are delegated to infrastructure (e.g. [Caddy](https://caddyserver.com) for automatic HTTPS and routing, and a process manager or replicas for using every CPU). See [docs/adr/0001-multi-process-share-nothing.md](./docs/adr/0001-multi-process-share-nothing.md).

## [`@sergiogc9/nodejs-utils`](./packages/utils)

Framework utilities used by the server and importable on their own:

- `Log` — pino logger with optional Pushover alerts.
- `Api` — `successResponse` / `errorResponse` envelope helpers and error codes.
- `Auth` — `httpAuthMiddleware`, `authMiddleware`, `authBearerMiddleware`.
- `Cache` — in-memory LRU response cache.
- `Pushover` — push notifications via the native fetch API.

## Development

Requires Node 26 and pnpm.

```bash
pnpm install
pnpm build        # build every package
pnpm test         # run the Vitest suite
pnpm typecheck    # type-check packages and examples
pnpm lint         # ESLint (flat config)
pnpm start        # run the example server (examples/index.ts)
```

Releases are managed with [Changesets](https://github.com/changesets/changesets).

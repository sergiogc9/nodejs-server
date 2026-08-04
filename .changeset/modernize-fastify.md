---
'@sergiogc9/nodejs-server': major
'@sergiogc9/nodejs-utils': major
---

Full rewrite on a modern stack: Fastify 5, ESM-only, Node 26, pnpm workspaces + Changesets, tsup builds and Vitest tests.

- **Server**: `createServer()` and the `Server` / `ApiServer` / `StaticServer` / `SSRApiServer` classes over Fastify. Zod-first request/response validation with OpenAPI docs generated from the schemas, structured pino logging, `@fastify/helmet` / `cors` / `compress` / `rate-limit` / `static` / `view`, and graceful shutdown via `close-with-grace`.
- **Utils**: `Log` (pino + Pushover alerts), `Api` (`successResponse` / `errorResponse` + error codes), `Auth` (`httpAuthMiddleware` / `authMiddleware` / `authBearerMiddleware`), `Cache` (LRU) and `Pushover` (native fetch). All share-nothing (no global singletons) and safe across multiple processes.

**Breaking**: proxy, TLS/HTTPS and cluster are removed (delegated to infrastructure such as Caddy and a process manager). The API is now Fastify-based (routes are Fastify plugins, not Express routers).

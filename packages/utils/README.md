# @sergiogc9/nodejs-utils

Framework utilities used by [`@sergiogc9/nodejs-server`](../server) and importable on their own. Each is available as a subpath export:

- `@sergiogc9/nodejs-utils/Log` — pino logger with optional Pushover alerts (`new Log({ level, pretty, pushover })`).
- `@sergiogc9/nodejs-utils/Api` — `successResponse` / `errorResponse` envelope helpers and error code constants.
- `@sergiogc9/nodejs-utils/Auth` — `httpAuthMiddleware`, `authMiddleware`, `authBearerMiddleware` Fastify preHandlers.
- `@sergiogc9/nodejs-utils/Cache` — in-memory LRU response cache (`new Cache().cache(seconds)`).
- `@sergiogc9/nodejs-utils/Pushover` — push notifications via the native fetch API.

All utilities are share-nothing (no global singletons) and safe across multiple processes. `fastify` is a peer dependency.

See the [repository README](../../README.md) for the full overview.

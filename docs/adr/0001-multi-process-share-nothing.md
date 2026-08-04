# 1. Multi-process, share-nothing design

- Status: accepted
- Date: 2026-08-04

## Context

The old server managed its own concurrency with the Node `cluster` API (forking one worker per CPU) and terminated TLS itself. In the modern setup TLS and the reverse proxy are delegated to infrastructure (e.g. Caddy) and horizontal scaling is delegated to a process manager or replicas: the same application runs as **N identical processes** (`pm2 -i max`, several instances behind a load balancer, etc.).

For that to be correct, the code must not assume it is the only process running. The old code did in a few places (in-memory rate limiter, global singletons via `getGlobalSingleton`, daily log files written by every worker).

## Decision

The library is **share-nothing**. Correctness must never depend on there being a single process. Concretely:

1. **No global singletons.** Modules export classes/factories the consumer instantiates (`new Log(...)`, `new Cache(...)`). A per-process instance is the correct granularity; the `global`-object singleton hack is gone.
2. **In-memory state is process-local and optimisation-only.** The LRU `Cache` and the rate limiter are per-process. Anything that must be globally consistent (a shared rate limit, a shared cache) must use an external store such as Redis — otherwise the per-process semantics are documented and accepted.
3. **Logs go to stdout** (pino), never to shared files. The platform/process manager collects and aggregates them.
4. **Auth is stateless** (HTTP basic / bearer). No in-memory sessions.
5. **No "run once" work at boot.** Database migrations, seeds and one-off jobs must not live in the server boot path — they would run once per process. They belong in a separate command.
6. **Periodic jobs must be process-singletons.** Any interval/cron that must run once needs a leader/lock or a dedicated process, not "one per worker".
7. **Config is read-only after boot.** Each process builds the same immutable config; there is no shared mutable global config.

## Consequences

- Running 1 or N processes yields the same behaviour.
- `@fastify/rate-limit` runs in memory by default; a Redis store is the escape hatch for a global limit.
- The `Database` provider opens a Mongoose pool per process (correct) and never runs migrations.
- Removing in-app clustering also removed the cluster-aware rate limiter and the global-singleton indirection, making the code simpler.

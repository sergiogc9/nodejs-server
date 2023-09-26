# NodeJS Server

![](https://badgen.net/npm/v/@sergiogc9/nodejs-server?icon=npm&label)
![](https://github.com/sergiogc9/nodejs-server/workflows/Github%20Pipeline/badge.svg?branch=master)

A NodeJS server using Typescript. This server is used by myself in other personal projects.

It is an easy to setup nodejs based server which allows to start different kind of services that can be run isolated or together in a unique server instance:

- Serving static files located in a directory. Useful to serve a SPA (Single Page Application) in React, Angular, etc.
- Serving an API using cluster, express, mongoose, openapi, swagger and others.
- Serving an API based website using SSR (Server Side Rendering) with express and EJS.
- Working as a single entry point in a server using Proxy and / or reverse proxy.
- Executing extra nodeJs code in cluster by using the NodeJS cluster API.

### Table of Contents

- [NodeJS Server](#nodejs-server)
- [Table of Contents](#table-of-contents)
- [Getting started](#getting-started)
- [Usage](#usage)
  - [Full server](#full-server)
  - [Static web server](#static-web-server)
  - [API Server](#api-server)
  - [Server Side Rendering (SSR) server](#server-side-rendering-ssr-server)
  - [Proxy server](#proxy-server)
  - [HTTPS and SSL certificates](#https-and-ssl-certificates)
    - [Using LetsEncrypt](#using-letsencrypt)
    - [Using custom SSL certificates](#using-custom-ssl-certificates)
- [Configuration options](#configuration-options)
  - [Common options](#common-options)
  - [Static server options](#static-server-options)
  - [API server options](#api-server-options)
  - [Server side server options](#server-side-server-options)
  - [Proxy server options](#proxy-server-options)
  - [Full server options](#full-server-options)

### Getting started

To start using the server, install the package from npm, which comes with all needed types defined:

`yarn add -S @sergiogc9/nodejs-server` or `npm install --save @sergiogc9/nodejs-server`.

Then you can import, instantiate and start a new server:

```
import Server from '@sergiogc9/nodejs-server';

const server = new Server();
server.start();
```

ℹ️ The server instantiated above will result in a useless server, because all options are disabled by default. See docs below for further information.

### Usage

Depending on the requirements, you can import a different Server class from the package. All servers types receive a config object that varies for each type. Once instantiated, they have two different methods to start the server:

- `start(startFn)`: Runs the server in a single process (as default in NodeJS). It runs the function `startFn` if passed.

- `startCluster(masterFn, workerFn)`: Runs the server using multiple processes using the `cluster` API. If passed, the master process will execute `masterFn` and all worker processes will run the `workerFn`. By default, there is 1 master process and `N` worker processes determined by the result length of executing `os.cpus()` using the `OS` API. Using a cluster is useful, for example, to load balance the requests to the API using all available CPUs.

#### Full server

The full server has all features enabled. Useful if you need more than one type of server together. It is the default exported element of the package. A sample example if static, API and proxy features are wanted:

```typescript
import path from 'path';
import Server from '@sergiogc9/nodejs-server';

import router from './api/routes/Router';

const proxyPaths = [{ from: '/netdata', to: 'http://localhost:19999' }];

const server = new Server({
	// Static
	enableStaticWeb: true,
	staticSources: [{ folder: path.join(__dirname, './static/public'), path: '/public' }],

	// Api
	enableApi: true,
	apiPath: '/api/',
	openApiPath: path.join(__dirname, './api/openapi/openapi.yaml'),
	apiRoutes: [{ path: '/', router }],

	// Proxy
	enableProxy: true,
	proxyPaths: proxyPaths
});

server.start();
```

It accepts all configuration options for other servers defined below.

#### Static web server

The `StaticServer` only allows to serve content located in a directory. It is configured to serve a SPA web application, which means it is able to handle SPA url paths.

Example:

```typescript
import path from 'path';
import { StaticServer } from '@sergiogc9/nodejs-server';

const server = new StaticServer({
	// The directory where the build to serve is located
	staticSources: [{ folder: path.join(__dirname, './static/public'), path: '/public' }]
});

server.start();
```

#### API Server

The `ApiServer` allows to serve an API using express. The only required configuration option is an array of paths handled by a custom Router instance which should handle them. Also it can be optionally configured with:

- Enabling CORS to improve security.
- Change API base path (by default is `/api/`).
- Enable OpenApi and Swagger. If enabled, a docs page is turned on in `/docs` path, also request parameters and response are automatically validated using the OpenApi schema specified.

Example:

```typescript
import path from 'path';
import { ApiServer } from '@sergiogc9/nodejs-server';

// Import custom router from somewhere
import router from './api/routes/Router';

const server = new ApiServer({
	apiPath: '/api/',
	openApiPath: path.join(__dirname, './api/openapi/openapi.yaml'),
	apiRoutes: [{ path: '/', router }]
});

server.start();
```

#### Server Side Rendering (SSR) server

The `SSRApiServer` allows to serve a server side rendering based website using express and `ejs`. The only required configuration options are an array of paths handled by a custom Router instance which should handle the requests and the directory path where all page templates are defined. Also it can be optionally configured with:

- Enabling CORS to improve security.
- Change API base path (by default is `/web/`).
- Set a "public" directory where to locate static assets only related to the SSR content.

  ⚠️ The content in this directory will be served under the SSR path. You can use the static server option instead.

ℹ️ By default, a predefined error page is used if some error happen (404, 500, etc). To overwrite the error page, a template inside the views directory has to be set in path `pages/error.ejs`.

Example:

```typescript
import path from 'path';
import { SSRApiServer } from '@sergiogc9/nodejs-server';

// Import custom router from somewhere
import router from './api/routes/Router';

const server = new SSRApiServer({
	ssrApiPath: '/web',
	ssrViewsPath: path.join(__dirname, './views'),
	ssrPublicPath: path.join(__dirname, './public'),
	ssrApiRoutes: [{ path: '/', router }]
});

server.start();
```

#### Proxy server

The `ProxyServer` allows to define some proxy rules using reverse proxies. It can be used as a single entry point to redirect requests to other server instances inside the same machine, network, etc.

Use the `hostname` option inside each path to make a specific proxy rule to work only with an specific hostname (DNS domain).

Example:

```typescript
import { ProxyServer } from '@sergiogc9/nodejs-server';

const proxyPaths = [
	{ from: '/netdata', to: 'http://localhost:19999' },
	{ from: '/private', to: 'http://10.0.1.10:3000' }
];

const server = new ProxyServer({
	proxyPaths: proxyPaths
});

server.start();
```

#### HTTPS and SSL certificates

The server supports HTTPS enabling the option `enableHTTPS` with **multiple domains**. It is fully compatible with [LetsEncrypt](https://letsencrypt.org/) and [certbot](https://certbot.eff.org/) but also with custom SSL certificates.

Once HTTPS is enabled, the server detects the domain in each request and tries to find a SSL certificate. If the certificate does not exist, it uses an untrusted temporary SSL certificate valid for 1 day.

Valid SSL certificates must be provided, using LetsEncrypt or another provider.

##### Using LetsEncrypt

Install the `certbot` following the instructions [here](https://certbot.eff.org/instructions). Then run the server with the `enableHTTPS` option as `true` and with the `port` set to `443`.

When the server is running, just add the certificate into the server:

```bash
sudo certbot certonly --webroot --keep-until-expiring --agree-tos -w $ABSOLUTE_PATH/letsencrypt -d DOMAIN
```

> ℹ️ `$ABSOLUTE_PATH` is the path where the server is located. It will create a `letsencrypt` directory.

The server automatically adds the necessary routes needed for letsencrypt to validate the server. Once the certificate is generated, restart the server.

##### Using custom SSL certificates

If using LetsEncrypt is not an option, you can provide your custom certificates using the `sslCertificatesDirectory` option. The option must have the path for a directory where the certificates are placed following this structure:

- Certificates directory folder:
  - [folder named as each domain]
    - `privkey.pem`
    - `fullchain.pem`

### Configuration options

##### Common options

| Option                     | Description                                                                                                                                                                  | Type                                                              | Default                  |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------ |
| `port`                     | The port to used by the server.                                                                                                                                              | number                                                            | 4000                     |
| `mongoUri`                 | The mongo uri used to connect to the database. <br> If not provied, no connection is done.                                                                                   | string                                                            |                          |
| `auth`                     | Object containing the HTTP authentication config if wanted. <br/>`users` is an object with all users and passwords. <br/>`realm` must be a unique identifier for the server. | {<br/>users: { [user: string]: string },<br/>realm: string<br/> } |                          |
| `enableSSL`                | Use HTTP server. Requires using LetsEncrypt or providing custom SSL certificates.                                                                                            | boolean                                                           | false                    |
| `redirectToHTTPS`          | Redirect from HTTP to HTTPS automatically when HTTPS is enabled. If enabled, the server will always listen on port 80 for HTTP requests.                                     | boolean                                                           | true                     |
| `sslCertificatesDirectory` | The directory which contains the SSL certificates for the domains. It must contain a folder for each domain with `fullchain.pem` and `privkey.pem` files in each.            | string                                                            | `/etc/letsencrypt/live/` |
| `enableRateLimiter`        | Enables rate limiter to avoid DDoS and brute force attacks                                                                                                                   | boolean                                                           | false                    |

##### Static server options

| Option          | Description                                                                                                                                                                               | Type                                                       | Default |            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------- | ---------- |
| `staticSources` | Array of sources containing static content. The `folder` is the directory where static web files are located and the `path` is the base endpoint path where the static content is served. | { folder: string, path: Router , auth?: HTTPAuthConfig }[] |         | `required` |

##### API server options

| Option        | Description                                                                                                                                                | Type                               | Default |            |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------- | ---------- |
| `apiPath`     | The base endpoint path where the API is served.                                                                                                            | string                             | `/api/` |            |
| `apiCors`     | Valid CORS used in the API. Each origin can be a string or a RegExp. <br> If not provided, CORS is not enabled.                                            | string[]                           |         |            |
| `openApiPath` | Directory where the openapi files are located. <br> If not provided, swagger based docs is not served and the openapi automatic validation is not enabled. | string                             |         |            |
| `apiRoutes`   | The routes to be served in the API. Each path should have a valid express `Router` instance.                                                               | { path: string, router: Router }[] |         | `required` |

##### Server side server options

| Option          | Description                                                                                                                                                          | Type                               | Default |            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------- | ---------- |
| `ssrApiPath`    | The base endpoint path where the API is served.                                                                                                                      | string                             | `/ssr/` |            |
| `ssrApiCors`    | Valid CORS used in the API. Each origin can be a string or a RegExp. <br> If not provided, CORS is not enabled.                                                      | string[]                           |         |            |
| `ssrPublicPath` | The path where public content for SSR is located. The assets will be served behind the /public path after `ssrApiPath`. If not set not public assets will be served. | string                             |         |            |
| `ssrApiRoutes`  | The routes to be served in the API. Each path should have a valid express `Router` instance.                                                                         | { path: string, router: Router }[] |         | `required` |

##### Proxy server options

| Option       | Description                                                                                                                    | Type                                              | Default |            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ------- | ---------- |
| `proxyPaths` | An array with all the proxies data. If hostname is provided, the proxy only will work if the request comes from this hostname. | { from: string, hostname?: string, to: string }[] |         | `required` |

##### Full server options

This options tells the full Server which specific server features should be enabled.

| Option            | Description                          | Type    | Default |
| ----------------- | ------------------------------------ | ------- | ------- |
| `enableStaticWeb` | Enable or disable static web server. | boolean | `false` |
| `enableApi`       | Enable or disable the API.           | boolean | `false` |
| `enableSSRApi`    | Enable or disable the SSR based API. | boolean | `false` |
| `enableProxy`     | Enable or disable the proxy server.  | boolean | `false` |

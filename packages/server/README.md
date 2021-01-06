# NodeJS Server

A bases NodeJS server using Typescript. This server is used by myself in other personal projects.

It is an easy to setup nodejs based server which allows to start different kind of services that can be run isolated or together in a unique server instance:

- Serving static files located in a directory. Useful to serve a SPA (Single Page Application) in React, Angular, etc.
- Serving an API using cluster, express, mongoose, openapi, swagger and others.
- Serving an API based website using SSR (Server Side Rendering) with express and EJS.
- Working as a single entry point in a server using Reverse Proxy.
- Executing extra nodeJs code in cluster by using the NodeJS cluster API.

### Installation

// TODO!
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

The full server has all features enabled. Useful if you need more than one type of server together. It is the default exported element of the package. A sample example if static, API and reverse proxy features are wanted:

```typescript
import path from 'path';
import Server from '@sergiogc9/nodejs-server';

import router from './api/routes/Router';

const proxyPaths = [
    { from: '/netdata', to: 'http://localhost:19999' }
];

const server = new Server({
    // Static
    enableStaticWeb: true,
    staticWebFolder: path.join(__dirname, './static/public'),

    // Api
	enableApi: true,
	apiPath: '/api/',
	openApiPath: path.join(__dirname, './api/openapi/openapi.yaml'),
	apiRoutes: [
		{ path: '/', router }
	],

    // Reverse proxy
    enableReverseProxy: true,
    reverseProxyPaths: proxyPaths
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
    staticWebFolder: path.join(__dirname, './static/public')
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
	apiRoutes: [
		{ path: '/', router }
	],
});

server.start();
```

#### Server Side Rendering (SSR) server

The `SSRApiServer` allows to serve a server side rendering based website using express and `ejs`. The only required configuration options are an array of paths handled by a custom Router instance which should handle the requests and the directory path where all page templates are defined. Also it can be optionally configured with:

- Enabling CORS to improve security.
- Change API base path (by default is `/web/`).
- Set a "public" directory where to locate static assets only related to the SSR content.

    ⚠️  The content in this directory will be served under the SSR path. You can use the static server option instead.

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
	ssrApiRoutes: [
		{ path: '/', router }
	]
});

server.start();
```

#### Reverse proxy server

The `ReverseProxyServer` only allows to define some HTTP redirects. It can be used as a single entry point to redirect requests to other server instances inside the same machine, network, etc.

Example:

```typescript
import { ReverseProxyServer } from '@sergiogc9/nodejs-server';

const proxyPaths = [
    { from: '/netdata', to: 'http://localhost:19999' },
    { from: '/private', to: 'http://10.0.1.10:3000' }
];

const server = new ReverseProxyServer({
    // Reverse proxy
    reverseProxyPaths: proxyPaths
});

server.start();
```


### Library

A set of libraries, tools, providers, middlewares, etc. This library is used by the Server but they can be imported and used in other projects.

More information and documentation about each library can be found on its corresponding Readme.


### Configuration options

// TODO REMOVE Library from here!
// Common options
// Separate specific options by server type!

# NodeJS Server

A bases NodeJS server and libs using Typescript. This project is used by myself in other personal projects. It is separated in two main packages:

### Server

An easy to setup nodejs based server which allows to start different kind of services that can be run isolated or together in a unique server instance:

- Serving static files located in a directory. Useful to serve a SPA (Single Page Application) in React, Angular, etc.
- Serving an API using cluster, express, mongoose, openapi, swagger and others.
- Serving an API based website using SSR (Server Side Rendering) with express and EJS.
- Working as a single entry point in a server using Reverse Proxy.
- Executing extra nodeJs code in cluster by using the NodeJS cluster API.

A very simple example of use can be:

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

For further docs or examples, see examples folder or server package Readme (in /packages/server).


### Library

A set of libraries, tools, providers, middlewares, etc. This library is used by the Server but they can be imported and used in other projects.

More information and documentation about each library can be found on its corresponding Readme.

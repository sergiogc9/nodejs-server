# NodeJS Utils

![](https://badgen.net/npm/v/@sergiogc9/nodejs-utils?icon=npm&label)
![](https://github.com/sergiogc9/nodejs-server/workflows/Github%20Pipeline/badge.svg?branch=master)

This package provides a several set of tools, libraries or utilities that I use in my projects as well as in the `@sergiogc9/nodejs-server` package.

### Table of Contents

- [NodeJS Utils](#nodejs-utils) - [Table of Contents](#table-of-contents) - [Getting started](#getting-started) - [Available modules](#available-modules) - [API](#api) - [Log](#log) - [Cache](#cache) - [Pushover](#pushover)

### Getting started

You can get everything importing the whole package or import only some available sub-modules. To install the package:

`yarn add -S @sergiogc9/nodejs-server` or `npm install --save @sergiogc9/nodejs-server`

### Available modules

#### API

This module contains some methods, middleware and constants to be used in your API controllers using `express`:

- Constants can be used to keep same response codes or errors between different APIs. Available constants:

  `SERVER_ERROR`, `OPENAPI_VALIDATION_ERROR` and `NOT_FOUND_ERROR`.

- Methods exported by the API module:

  `successResponse(req, res, data, status = 200)`:

  Sends a success response through the passed response (res). It returns a JSON with the following keys:

  **request**: An object containing some request data as the body, method, path, parameters, body, etc.

  **response**: The data to send. It can be any JSON serializable data.

  **status**: The response status. By default is 200.

  **time**: The execution time. Only appears if the request has a Date _startTime_ property added using a middleware as _@sergiogc9/nodejs-server_ does.

  `errorResponse(req, res, data, status)`:

  Sends an error response through the passed response (res). It behaves the same as the method successResponse with these differences:

  - There is not a default status, hence it is required.
  - The data returned is done through an _error_ key instead of _response_.

- The middlewares available are:

  `expressAsyncHandler`:

  An express middleware to use an async function inside a controller.

Example usage:

```ts
import { RequestHandler, Router } from 'express';
import { expressAsyncHandler, errorResponse, successResponse, SERVER_ERROR } from '@sergiogc9/nodejs-utils/Api';

import User from 'models/User';

class UserController {
	public static list: RequestHandler = async (req, res) => {
		try {
			const users = await User.find();
			successResponse(req, res, users);
		} catch (e) {
			errorResponse(req, res, SERVER_ERROR, 500);
		}
	};
}

const router = Router();
router.get('/team', expressAsyncHandler(UserController.list));
```

#### Log

A helper utility to more fancy logs. It creates a `.logs` directory inside the project root and creates a log file per each day.

It generate logs using the following format:

```
[DD/MM/YYYY HH:MM] [PROCESS_ID] [PREFIX] [TYPE] Text
```

Example:

```
[03/02/2021 17:33] [MASTER] [API] [INFO] Booting the 'Time' middleware..
```

From left to right:

- Date: The date and time when the log was added.
- Process id: If using cluster, it shows the pid of the process. If not using the cluster api or the log comes from the master process, `MASTER` is shown.
- Prefix: You can create a custom Log instance with a prefix (see example below). If a prefix is set, the prefix name is shown.
- Type: The log type. It can be _info_, _warn_, _error_ or a custom one.
- Text: The message to log.

The Log module exports by default a singleton instance ready to be used. If you want a **custom Log** with a custom prefix you can use the instance method `initNewLog(prefix)` or create a new `Log` instance passing the prefix in the constructor to Log class, which is named exported.

ℹ️ When using a custom prefix, all logs are also located in `.logs/${prefix}` directory.

Example using the default exported Log instance:

```ts
import log from '@sergiogc9/nodejs-utils/Log';

log.warn('Some warning message');
```

Example using a custom prefix:

```ts
import { Log } from '@sergiogc9/nodejs-utils/Log';

const log = new Log('api');
log.info("Booting the 'Time' middleware..");
log.custom('GENERAL', 'Some general message');
```

#### Auth

The Auth module contains some middleware and utils to easily add authentication into the server.

Available middlewares:

- `httpAuthMiddleware`:

  This middleware enables HTTP authentication. It needs a `realm` and an object containing the users and their password. The `realm` must be unique for each server and passwords **must be hashed using SHA512**:

  ```ts
  type HTTPAuthConfig = { realm: string; users: Record<string, string> };
  ```

  Enable HTTP authentication in all the server:

  ```ts
  import { httpAuthMiddleware } from '@sergiogc9/nodejs-utils/Auth';

  app.use(httpAuthMiddleware({ realm: '@sergiogc9/nodejs-utils', users: { user: 'SHA512 hash' } }));
  ```

  Enable HTTP authentication only for a specific route:

  ```ts
  import { httpAuthMiddleware } from '@sergiogc9/nodejs-utils/Auth';

  const authCredentials: HTTPAuthConfig = { realm: '@sergiogc9/nodejs-utils', users: { user: 'SHA512 hash' } };
  app.get('/auth', httpAuthMiddleware(authCredentials), expressAsyncHandler());
  ```

#### Cache

A cache middleware for _express_ routes. It caches the response of a request by its `originalUrl` or `url`. It is based on `memory-cache` package.

Example of use:

```ts
import { Router } from 'express';
import Cache from '@sergiogc9/nodejs-utils/Cache';

const { cache } = Cache;
const router = Router();

// Cache response during 10 seconds
router.get('/', cache(10), HomeController.index);
```

#### Pushover

Static utility class that helps sending notifications using [Pushover](https://pushover.net/).

You only need to introduce the user config data once and then use the `send` static method. Example of use:

```ts
// Set user config data
Pushover.setUserConfig({
	user: 'user-id',
	token: 'app-token'
});
Pushover.send({ title: 'Wow!', message: 'Awesome message' });
```

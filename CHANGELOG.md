# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.1](https://github.com/sergiogc9/nodejs-server/compare/v1.2.0...v1.2.1) (2023-08-10)

### Bug Fixes

- Log util now prints to console too ([d08d50d](https://github.com/sergiogc9/nodejs-server/commit/d08d50d64abb5b5606763bef8e7860e71713b6d2))
- Stop sending alert in log when a SSL is not found ([bbe7013](https://github.com/sergiogc9/nodejs-server/commit/bbe7013d359ca46435e7dcf89cdb4eea6404dfae))

# [1.2.0](https://github.com/sergiogc9/nodejs-server/compare/v1.1.0...v1.2.0) (2023-08-10)

### Bug Fixes

- Solve issue where utils singleton classes were failing when using different imports ([829f237](https://github.com/sergiogc9/nodejs-server/commit/829f2374cbcb11950856835d6a3b24c1ad5ece12))

### Features

- Add authentication middlewares ([bf90625](https://github.com/sergiogc9/nodejs-server/commit/bf9062539c4e733ee4a1c7f9f13e55b992b8eb7c))

# [1.1.0](https://github.com/sergiogc9/nodejs-server/compare/v1.0.1...v1.1.0) (2023-08-09)

### Features

- Add compatibily with HTTPS and SSL certificates for different domains ([db9ec61](https://github.com/sergiogc9/nodejs-server/commit/db9ec61d629a035f8a90a43d04823129b0584a22))
- Add httpAuthMiddleware middleware in utils package ([f084487](https://github.com/sergiogc9/nodejs-server/commit/f084487ede2adb4059aa70ea530dfc671155fec1))
- Add option to enable HTTPAuth in each route in StaticServer ([af98ce5](https://github.com/sergiogc9/nodejs-server/commit/af98ce5e59baa866096e123857758c8e27053b71))
- Use SHA512 hashed passwords when using HTTP authentication middleware ([715c967](https://github.com/sergiogc9/nodejs-server/commit/715c967eb678b7e4d06420f6f692622a59de2640))

# [0.3.0](https://github.com/sergiogc9/nodejs-server/compare/v0.2.3...v0.3.0) (2023-01-22)

### Features

- Add HTTP Authentication in server ([d79ee22](https://github.com/sergiogc9/nodejs-server/commit/d79ee22c7058987ae3ce512404dfea0796771b53))

## [0.2.3](https://github.com/sergiogc9/nodejs-server/compare/v0.2.2...v0.2.3) (2022-06-23)

### Bug Fixes

- Update some libs versions and fix dependandbot alerts ([6b95c3f](https://github.com/sergiogc9/nodejs-server/commit/6b95c3f9e5579f9355ab9c1519e9880a43e9bf35))

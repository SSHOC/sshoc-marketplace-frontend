# SSHOC Marketplace Frontend

## How to run

You can use Docker to run the app with:

```shell
docker-compose up --build -d
```

The container will use [`serve`](https://github.com/zeit/serve) to serve the app
on port 3000.

Note that the app expects the backend server on port 8080.

## How to contribute

Make sure you have [NodeJS](https://nodejs.org/en/) and
[Yarn](https://yarnpkg.com/lang/en/) installed.

Clone the repository and install the project's dependencies:

```shell
yarn
```

Run the development build:

```shell
yarn start
```

To run the production build locally:

```shell
yarn build && yarn serve
```

Also, make sure to have either the mock server or the development build of the
backend server running at port 8080. You can start the mock server with:

```shell
yarn mockserver
```

Contributions should follow the [project's guidelines](/CONTRIBUTING.md).

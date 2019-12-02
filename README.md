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
REACT_APP_API_BASE_URL=http://localhost:8080 yarn build && yarn serve
```

Also, make sure to have either the mock server or the development build of the
backend server running at port 8080. You can start the mock server with:

```shell
yarn mockserver
```

Contributions should follow the [project's guidelines](/CONTRIBUTING.md).

## Component library

You can view components in isolation in storybook:

```shell
yarn start:storybook
```

To run a static storybook build:

```shell
yarn build:storybook && yarn serve:storybook
```

Or simply run the Docker container:

```shell
docker-compose -f docker-compose-storybook.yml up --build -d
```

Storybook will run on port 9009.

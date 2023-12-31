# Swift-Cloud

Backend API server for Swift Cloud.

## Table of Content

- [Swift Cloud](#swift-cloud)
  - [Table of Content](#table-of-content)
  - [Prerequisite](#prerequisite)
  - [Environment Setup](#environment-setup)
    - [Environment Variable](#environment-variable)
    - [Database setup](#database-setup)
  - [Quick Start](#quick-start)
  - [Package Scripts](#package-scripts)
  - [Code Structure (default)](#code-structure-default)
  - [Commit Message](#commit-message)
  - [What I will do next](#to-do)

## Prerequisite

- Node ^12
- Postgresql 12+
- Sequelize Cli

### Environment Variable

1. Create a `.env` file based on `.env.template`
2. Update the values in the `.env` file
3. Create a `.env.test` file based on `.env` file

### Database setup

1. Create a new database named `swift_cloud`
2. Create a new user with write access to the `swift_cloud` database if necessary
3. Install `sequelize-cli`
4. Run migration:

```sh
$ sequelize db:migrate:status # Checking if connection is alright
$ sequelize db:migrate # Migrate database table
```

## Quick Start

Make sure you have completed the environment setup.

```sh
$ npm install
$ npm build
$ npm run watch
```

or, start app using Docker

```sh
$ npm run build-docker
$ npm run watch-docker
```

### Seeding Initial Data

The seed data is done via a pipeline that transforms the raw data into the database.

Once the app has started, invoke the /imports/songs API by sending in the [SwiftCloud - Sheet1.csv](https://github.com/liam9408/swift-cloud/blob/dev/SwiftCloud%20-%20Sheet1.csv) file to seed the data. The API documentation can be found below:

## API Documentation

https://documenter.getpostman.com/view/17195991/2s9YCASWTe

## Deployed App

Base API Url:
https://tidal-solstice-399711.as.r.appspot.com

![swift-cloud-backend-architecture](https://lh3.googleusercontent.com/pw/AIL4fc98pPc-i5RX93ShHxyl9p777omR1P-QHdboOF0pWCQnzYjP6ho9aunS_Noal1eiRbeiemBV7ZB9MYGlhZoxZjEAUXV2VmT6BQfNOev49TXY24VS94vF6opgBY_V5VE44xIHnAEwfFL7u6bMLlATjS4Tm5hB-pFvcWb1V7RkOXUDvdtE86SaLYyGUM3ZXuK2bQf2n5uEb62N5UjljUJcY53_WXDKcvXMXiQPJINnsPYJoqYy6SO6TcXm6wjYUcdCqGfa0nJ1FgaLMMrx_o8qD38_aJTw8Av6ac43v4wW5Js8hadaQsUOob2vfeI5ZJ_TUs3slzuZIiuiFWm0olKXwQ1vXn9kE9EDxhGm51a0LYrraySF8nxk2g77Us0mrS6q8TmfP3JVYSap277t-zO7t1tpESsthslz7wGdrBiQXzcvMwzVKCpxd_7JAfMCN4SI-zKpSKuXziiMlHPkk4IRcScd7fEXgDzwMxgeAk4hz8cNYQskIrnjLa_qZVssZh8_73PC6_QlW4KRsu5dOXBAZCUcw0HSl1z0CO_kv5bpr-axBWv9NKImdr0mKtdmDy63LczIS64BSV4A_IdLcqUD3cEJ9RWx7MFo4eQCQWg3uLcIWEOwqfaGwBqshYejbv97hOJYAkpz9JsBWYJjYmdUi-83awEwa_IKTdQ-abdwhH6QvF83eDQ8etpgcb_2_hWc66F7XKeOUIaN3rxc6_rtFLnKy6FkredFmlc4_T9gwNADhTJI05Aejg7mlvU8d-0-cpezm70xSHzZ9_bTkrNtWDUfrks64tEdWFIcfalUIoNTldFgxk31j3Ck4v__bR_8xFhnpF5pVPVlbog-Z269pDRo84sOZoTwj3GkU_1Gm0xxVvSHvaHt_gzQn9FtFTYcaNG6AXwp6vYPYi1Kj0s-ww95AJeU0b3p9SiagtLeEYNvRV78qA_4Lsqwe98iJz1YGRLqgbNJoTkKulX-ayyr_xLw5R5nyLNO=w878-h435-s-no?authuser=0)

## Package Scripts

- Run the Server in development mode : `npm run watch`.
- Build project: `npm run build`.
- Run all unit tests: `npm run test`.
- Check for linting errors: `npm run lint`.

## Code Structure (default)

```bash
│
├── /src
│   ├── /configs
│   │   ├── ioc.config.ts
│   │   └── server.config.ts
│   │
│   ├── /constants
│   │   └── index.ts
│   │
│   ├── /controllers
│   │   ├── album.controller.ts
│   │   ├── artists.controller.ts
│   │   ├── default.controller.ts
│   │   ├── import.controller.ts
│   │   └── songs.controller.ts
│   │
│   ├── /db
│   │   ├── /migrations
│   │   └── /models
│   │
│   ├── /enums
│   │   └── index.ts
│   │
│   ├── /lib
│   │   └── songs.parser.ts
│   │
│   ├── /exceptions
│   │   ├── errors.ts
│   │   └── HttpException.ts
│   │
│   ├── /middlewares
│   │   ├── /apiLogger
│   │   │   ├── log.ts
│   │   │   └── index.ts
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── csvValidator.middleware.ts
│   │
│   ├── /routes
│   │   ├── album.route.ts
│   │   ├── artists.route.ts
│   │   ├── default.route.ts
│   │   ├── import.route.ts
│   │   └── songs.route.ts
│   │
│   ├── /services
│   │   ├── albums.service.ts
│   │   ├── albumSongs.service.ts
│   │   ├── artist.service.ts
│   │   ├── songArtist.service.ts
│   │   ├── songPlay.service.ts
│   │   ├── songs.service.ts
│   │   └── songWriter.service.ts
│   │
│   ├── /tests
│   │
│   ├── /types
│   │
│   ├── /utils
│   │
│   ├── app.ts
│   ├── environment.ts
│   └── server.ts
│
├── .env
├── .eslintrc.js
├── .gitignore
├── .sequelizerc
├── .prettierrc
├── sequelize.config.js
├── package.json
└── tsconfig.json
```

## Commit Message

| When               | Commit Message               |
| :----------------- | :--------------------------- |
| Add function       | feat: ⚡️ Add function       |
| Fix bug            | fix: 🐞 Fix bug              |
| Refactoring        | refactor: 🛠 Refactoring     |
| Add package        | package: 📦 Add package      |
| Fix readme         | docs: 📚 Fix readme          |
| Tool Setup         | chore: 🛠 Tool/Project setup |
| Improvements style | style: 👁 Improvements style |

### To-do

1. create auth middleware, authenticate user login and api key requests
2. add year range query for albums
3. allow searching songs by artist name
4. more test coverage
5. better way to seed data

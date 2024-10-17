@edifice.io/ts-client / [Exports](modules.md)

# Edifice TS Client

Edifice TS Client exposes frameworks for interacting with [entcore-based servers APIs](https://github.com/opendigitaleducation/entcore).
It is written in typescript, with minimal dependencies (axios at the moment).

## Prerequisites

- `pnpm: >= 9`
- `node: >= 18`

## Getting Started

### Install

```bash
pnpm add @edifice.io/client
```

## Documentation

As rule of thumb, **@edifice.io/ts-client never uses any browser-related technology** (no HTMLElement, Document, navigator...).
It focus exclusively on data exchange with the servers.

- [IConfigurationFramework](docs/interfaces/iconfigurationframework.md) is composed of 3 layers

  - Platform (apps, theme, analytics, i18n...)
  - School
  - User (preferences)

- [ISession](docs/interfaces/isession.md) of the connected user

  - user
  - description
  - currentLanguage
  - notLoggedIn
  - avatarUrl
  - currentApp (the one which initialized the framework)
  - hasWorkflow
  - hasRight

- [INotifyFramework](docs/interfaces/inotifyframework.md) for async messages

  - onLangReady
  - onSessionReady
  - onSkinReady
  - onOverridesReady
  - promisify (generic for creating/resolving/rejecting a Promise)
  - events (a publish/subscribe event broker)

- [ITransportFramework](docs/interfaces/itransportframework.md) wraps the HTTP protocol

- [IExplorerFramework](docs/interfaces/iexplorerframework.md) to look for resources

- [IWidgetFramework](docs/interfaces/iwidgetframework.md) dedicated to widgets conf/prefs

- and specific app frameworks for modeling their data
  - [ITimelineApp](docs/interfaces/itimelineapp.md)
  - ...

[Browse the full API documentation here](docs/modules.md)

## Additional developers notes

4 additional libs are installed by the `pnpm install` command.

- [ViteJS](https://vitejs.dev/) as a Bundler
- [Typedoc](https://typedoc.org/guides/doccomments/) to generate the markdown documentation, in **/docs**, from the Typescript comments in source code.
- [husky](https://github.com/typicode/husky) to install a local [git pre-commit hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks#_client_side_hooks), in order to run the unit-tests and update /docs before every commit.
  => **/docs will always be up-to-date on the git server**.

The `pnpm run build` command will populate the **/dist** directory

- **/dist/ts** contains the JS code and associated _.d.ts_ and _.js.map_ files, later packaged in NPM (done by our CI).
- **/dist/bundle** contains the production-ready code/map.

So, **you'll just have to write nice documented code, and unit tests** where needed !

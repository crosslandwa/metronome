# Metronome

A metronome built with the Web Audio API, React and Redux

## Application features

### Build

```bash
npm run build
# or
npm run watch #automatically re-build whenever changes are made
```

### Run

Build the app (see above), then start the dev server via:

```bash
npm run devserver
```

Then navigate your browser to http://localhost:8000

### Tests

```bash
npm test
```
Tests are run with [Jest](https://facebook.github.io/jest/)

### Linting

```bash
npm run lint
```

Linting is done with [ESLint](https://eslint.org/) and is configured to conform code to https://standardjs.com/

### ES6ified code

Rollup is configured with the appropriate [Babel](https://babeljs.io/) plugins to write the app with ES6 language features. This applies to both application code **and** test code

### Code choices

- CSS can be imported in the app via `import 'My.css'` - Rollup is configured to bundle CSS into the built JS artefact
- [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) extension is configured out of the box (requires dev tools be installed in the browser)

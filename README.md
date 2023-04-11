# linkthing

An iOS client for [linkding](https://github.com/sissbruecker/linkding/) built with [Ionic](https://ionicframework.com).

[Download from the App Store](https://apps.apple.com/us/app/linkthing/id1666031776)

## Requirements

- A server running linkding.
- node/npm/Ionic CLI

## Running Locally

### In a Browser

- First you will need to update the `local-cors-proxy` script in `package.json` to point to whatever your linkding URL is.
- In two separate terminals, run `npm run local-cors-proxy` and `npm run serve`

### iOS Simulator

- Run `npm run ios:run`

## Building for iOS

- Run `npm run ios:build` to make the build
- Run `npm run ios:open` to open in Xcode to adjust the version and build numbers.

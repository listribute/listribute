# Listribute

An app based on React Native for Android and iOS for sharing lists.

# Development

The app is written in TypeScript, so pretty much any editor will do.
Visual Studio Code is a good alternative as it has available plugins for ESLint
and Prettier, among other nice features.

## Prerequisites

Software needed to build and develop the application will depend on the target
and host platform. Follow instructions on: https://reactnative.dev/docs/environment-setup

### iOS

- Install XCode (and CLI tools)
- Install Ruby
- Run `bundle install`
- Go inside ios folder
- Run `pod install --repo-update`
- Run `bundle exec pod install`

## Run

```
$ yarn                      # Install node modules
$ yarn react-native start   # Start Metro (bundler)
$ yarn react-native run-ios # Launch iOS simulator and run app
```

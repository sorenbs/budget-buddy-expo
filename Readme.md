# Budget Buddy App

![Budget Buddy App Thumbnail](https://i.ytimg.com/vi/dl74XgJYK1A/maxresdefault.jpg)

## Introduction

This repository contains a version of the Budget Buddy app converted to use Prisma for React Native with reactive queries. This provides fully tyle-safe database access, and removes any manual view-update logic, as views are automatically re-rendered when the database is modified.

- Original Budget Buddy App: https://codewithbeto.dev/projects/budget-buddy-app


## Prisma for React Native

Prisma is a widely used ORM for JS/TS backend applications. It is fast, easy to use and provides auto-completion plus complete type-safety of both queries and returned data. At Expos [App.js Conference](https://appjs.co/) we announced that Prisma now supports Expo and React Native. Follow the [getting-started instructions here](https://github.com/prisma/react-native-prisma) to set up Prisma in your own project.

## Running the app

```
npm install
npx prisma generate
npx expo prebuild --clean
npx expo run:ios
```

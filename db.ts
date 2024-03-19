import '@op-engineering/react-native-prisma';
import { PrismaClient } from '@prisma/client/rn';

import 'react-native-url-polyfill/auto';
import { atob, btoa } from 'react-native-quick-base64';
import { reactiveHooksExtension } from "@op-engineering/react-native-prisma";

global.atob = atob;
global.btoa = btoa;

console.log("creating Prisma!!!!! Should only happen once !!!!!")

const basePrisma = new PrismaClient()

basePrisma.$applyPendingMigrations();

export const prisma = basePrisma.$extends(reactiveHooksExtension());
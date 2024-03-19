import '@op-engineering/react-native-prisma';
import { PrismaClient } from '@prisma/client/rn';
import { reactiveHooksExtension } from "@op-engineering/react-native-prisma";

const basePrisma = new PrismaClient()

basePrisma.$applyPendingMigrations();

export const prisma = basePrisma.$extends(reactiveHooksExtension());
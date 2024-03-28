import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { PrismaClient } from '@prisma/client/rn';
import { reactiveHooksExtension } from "@op-engineering/react-native-prisma";

export interface PrismaProviderProps {
  /**
   * The name of the database file to open.
   */
  databaseName: string;

  /**
   * The children to render.
   */
  children: React.ReactNode;

   /**
   * Handle errors from SQLiteProvider.
   * @default rethrow the error
   */
   onError?: (error: Error) => void;
}

const extendedPrisma = () => new PrismaClient().$extends(reactiveHooksExtension())
type PrismaClientExtended = ReturnType<typeof extendedPrisma>
const PrismaContext = createContext<PrismaClientExtended | null>(null);


/**
 * Context.Provider component that provides a SQLite database to all children.
 * All descendants of this component will be able to access the database using the [`usePrismaContext`](#useprismacontext) hook.
 */


export function PrismaProvider({
  databaseName,
  children,
  onError,
  ...props
}: PrismaProviderProps) {

  const databaseRef = useRef<PrismaClientExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function setup() {
      try {
        const internalPrisma = new PrismaClient()
        const prisma = internalPrisma.$extends(reactiveHooksExtension())

        databaseRef.current = prisma;
        setLoading(false);
      } catch (e: any) {
        setError(e);
      }
    }

    async function teardown(db: PrismaClientExtended | null) {
      try {
        await db?.$disconnect()
      } catch (e: any) {
        setError(e);
      }
    }

    setup();

    return () => {
      const db = databaseRef.current;
      teardown(db);
      databaseRef.current = null;
      setLoading(true);
    };
  }, [databaseName]);

  if (error != null) {
    const handler =
      onError ??
      ((e) => {
        throw e;
      });
    handler(error);
  }
  if (loading || !databaseRef.current) {
    return null;
  }

  // const databasePromise = getDatabaseAsync({
  //   databaseName,
  // });

  // const internalPrisma = new PrismaClient()
  // const prisma = internalPrisma.$extends(reactiveHooksExtension())


  // const [database, setDtabase] = useState<PrismaClientExtended | null>(null)

  // setDtabase(prisma)
  // const database = use(databasePromise);
  return <PrismaContext.Provider value={databaseRef.current}>{children}</PrismaContext.Provider>;
}












// async function getDatabaseAsync(args: { databaseName: string }) {
//   if (database != null) {
//     return database
//   }

//   const internalPrisma = new PrismaClient()
//   const prisma = internalPrisma.$extends(reactiveHooksExtension())
  
//   setData
//   return database
// }
// let database: Promise<PrismaClientExtended> | null = null

/**
 * A global hook for accessing the SQLite database across components.
 * This hook should only be used within a [`<SQLiteProvider>`](#sqliteprovider) component.
 *
 * @example
 * ```tsx
 * export default function App() {
 *   return (
 *     <SQLiteProvider databaseName="test.db">
 *       <Main />
 *     </SQLiteProvider>
 *   );
 * }
 *
 * export function Main() {
 *   const db = useSQLiteContext();
 *   console.log('sqlite version', db.getSync('SELECT sqlite_version()'));
 *   return <View />
 * }
 * ```
 */
export function usePrismaContext(): PrismaClientExtended {
  const context = useContext(PrismaContext);
  if (context == null) {
    throw new Error('usePrismaContext must be used within a <PrismaProvider>');
  }
  return context;
}

//#region Internals

//#region Private Suspense API similar to `React.use`

// Referenced from https://github.com/vercel/swr/blob/1d8110900d1aee3747199bfb377b149b7ff6848e/_internal/src/types.ts#L27-L31
type ReactUsePromise<T, E extends Error = Error> = Promise<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected';
  value?: T;
  reason?: E;
};

// function use(promise) {
//   if (promise.status === 'fulfilled') {
//     return promise.value;
//   } else if (promise.status === 'rejected') {
//     throw promise.reason;
//   } else if (promise.status === 'pending') {
//     throw promise;
//   } else {
//     promise.status = 'pending';
//     promise.then(
//       result => {
//         promise.status = 'fulfilled';
//         promise.value = result;
//       },
//       reason => {
//         promise.status = 'rejected';
//         promise.reason = reason;
//       },      
//     );
//     throw promise;
//   }
// }

// Referenced from https://github.com/reactjs/react.dev/blob/6570e6cd79a16ac3b1a2902632eddab7e6abb9ad/src/content/reference/react/Suspense.md
/**
 * A custom hook like [`React.use`](https://react.dev/reference/react/use) hook using private Suspense implementation.
 */
// function use<T>(promise: Promise<T> | ReactUsePromise<T>) {
//   // console.log(isReactUsePromise(promise))
//   if (isReactUsePromise(promise)) {
//     if (promise.status === 'fulfilled') {
//       if (promise.value === undefined) {
//         throw new Error('[use] Unexpected undefined value from promise');
//       }
//       return promise.value;
//     } else if (promise.status === 'rejected') {
//       throw promise.reason;
//     } else if (promise.status === 'pending') {
//       throw promise;
//     }
//     throw new Error('[use] Promise is in an invalid state');
//   }

//   const suspensePromise = promise as ReactUsePromise<T>;
//   suspensePromise.status = 'pending';
//   suspensePromise.then(
//     (result: T) => {
//       console.log("fulfilled")
//       suspensePromise.status = 'fulfilled';
//       suspensePromise.value = result;
//     },
//     (reason) => {
//       console.log("rejected")
//       suspensePromise.status = 'rejected';
//       suspensePromise.reason = reason;
//     }
//   );
//   throw suspensePromise;
// }

function isReactUsePromise<T>(
  promise: Promise<T> | ReactUsePromise<T>
): promise is ReactUsePromise<T> {
  // console.log(typeof promise === 'object')
  // console.log(promise !== null)
  // console.log('status' in promise)
  // console.log("___")
  return typeof promise === 'object' && promise !== null && 'status' in promise;
}

//#endregion
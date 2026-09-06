
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model TbCustPointSilverCurrent2017
 * 
 */
export type TbCustPointSilverCurrent2017 = $Result.DefaultSelection<Prisma.$TbCustPointSilverCurrent2017Payload>
/**
 * Model TbCustPointGoldCurrent2017
 * 
 */
export type TbCustPointGoldCurrent2017 = $Result.DefaultSelection<Prisma.$TbCustPointGoldCurrent2017Payload>
/**
 * Model TbCustPointSilverCashCurrent
 * 
 */
export type TbCustPointSilverCashCurrent = $Result.DefaultSelection<Prisma.$TbCustPointSilverCashCurrentPayload>
/**
 * Model TbCustGoldToAdjust
 * 
 */
export type TbCustGoldToAdjust = $Result.DefaultSelection<Prisma.$TbCustGoldToAdjustPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more TbCustPointSilverCurrent2017s
 * const tbCustPointSilverCurrent2017s = await prisma.tbCustPointSilverCurrent2017.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more TbCustPointSilverCurrent2017s
   * const tbCustPointSilverCurrent2017s = await prisma.tbCustPointSilverCurrent2017.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tbCustPointSilverCurrent2017`: Exposes CRUD operations for the **TbCustPointSilverCurrent2017** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbCustPointSilverCurrent2017s
    * const tbCustPointSilverCurrent2017s = await prisma.tbCustPointSilverCurrent2017.findMany()
    * ```
    */
  get tbCustPointSilverCurrent2017(): Prisma.TbCustPointSilverCurrent2017Delegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbCustPointGoldCurrent2017`: Exposes CRUD operations for the **TbCustPointGoldCurrent2017** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbCustPointGoldCurrent2017s
    * const tbCustPointGoldCurrent2017s = await prisma.tbCustPointGoldCurrent2017.findMany()
    * ```
    */
  get tbCustPointGoldCurrent2017(): Prisma.TbCustPointGoldCurrent2017Delegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbCustPointSilverCashCurrent`: Exposes CRUD operations for the **TbCustPointSilverCashCurrent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbCustPointSilverCashCurrents
    * const tbCustPointSilverCashCurrents = await prisma.tbCustPointSilverCashCurrent.findMany()
    * ```
    */
  get tbCustPointSilverCashCurrent(): Prisma.TbCustPointSilverCashCurrentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tbCustGoldToAdjust`: Exposes CRUD operations for the **TbCustGoldToAdjust** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TbCustGoldToAdjusts
    * const tbCustGoldToAdjusts = await prisma.tbCustGoldToAdjust.findMany()
    * ```
    */
  get tbCustGoldToAdjust(): Prisma.TbCustGoldToAdjustDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.10.0
   * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    TbCustPointSilverCurrent2017: 'TbCustPointSilverCurrent2017',
    TbCustPointGoldCurrent2017: 'TbCustPointGoldCurrent2017',
    TbCustPointSilverCashCurrent: 'TbCustPointSilverCashCurrent',
    TbCustGoldToAdjust: 'TbCustGoldToAdjust'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tbCustPointSilverCurrent2017" | "tbCustPointGoldCurrent2017" | "tbCustPointSilverCashCurrent" | "tbCustGoldToAdjust"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      TbCustPointSilverCurrent2017: {
        payload: Prisma.$TbCustPointSilverCurrent2017Payload<ExtArgs>
        fields: Prisma.TbCustPointSilverCurrent2017FieldRefs
        operations: {
          findUnique: {
            args: Prisma.TbCustPointSilverCurrent2017FindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCurrent2017Payload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TbCustPointSilverCurrent2017FindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCurrent2017Payload>
          }
          findFirst: {
            args: Prisma.TbCustPointSilverCurrent2017FindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCurrent2017Payload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TbCustPointSilverCurrent2017FindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCurrent2017Payload>
          }
          findMany: {
            args: Prisma.TbCustPointSilverCurrent2017FindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCurrent2017Payload>[]
          }
          create: {
            args: Prisma.TbCustPointSilverCurrent2017CreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCurrent2017Payload>
          }
          createMany: {
            args: Prisma.TbCustPointSilverCurrent2017CreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TbCustPointSilverCurrent2017DeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCurrent2017Payload>
          }
          update: {
            args: Prisma.TbCustPointSilverCurrent2017UpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCurrent2017Payload>
          }
          deleteMany: {
            args: Prisma.TbCustPointSilverCurrent2017DeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TbCustPointSilverCurrent2017UpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TbCustPointSilverCurrent2017UpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCurrent2017Payload>
          }
          aggregate: {
            args: Prisma.TbCustPointSilverCurrent2017AggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbCustPointSilverCurrent2017>
          }
          groupBy: {
            args: Prisma.TbCustPointSilverCurrent2017GroupByArgs<ExtArgs>
            result: $Utils.Optional<TbCustPointSilverCurrent2017GroupByOutputType>[]
          }
          count: {
            args: Prisma.TbCustPointSilverCurrent2017CountArgs<ExtArgs>
            result: $Utils.Optional<TbCustPointSilverCurrent2017CountAggregateOutputType> | number
          }
        }
      }
      TbCustPointGoldCurrent2017: {
        payload: Prisma.$TbCustPointGoldCurrent2017Payload<ExtArgs>
        fields: Prisma.TbCustPointGoldCurrent2017FieldRefs
        operations: {
          findUnique: {
            args: Prisma.TbCustPointGoldCurrent2017FindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointGoldCurrent2017Payload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TbCustPointGoldCurrent2017FindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointGoldCurrent2017Payload>
          }
          findFirst: {
            args: Prisma.TbCustPointGoldCurrent2017FindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointGoldCurrent2017Payload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TbCustPointGoldCurrent2017FindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointGoldCurrent2017Payload>
          }
          findMany: {
            args: Prisma.TbCustPointGoldCurrent2017FindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointGoldCurrent2017Payload>[]
          }
          create: {
            args: Prisma.TbCustPointGoldCurrent2017CreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointGoldCurrent2017Payload>
          }
          createMany: {
            args: Prisma.TbCustPointGoldCurrent2017CreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TbCustPointGoldCurrent2017DeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointGoldCurrent2017Payload>
          }
          update: {
            args: Prisma.TbCustPointGoldCurrent2017UpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointGoldCurrent2017Payload>
          }
          deleteMany: {
            args: Prisma.TbCustPointGoldCurrent2017DeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TbCustPointGoldCurrent2017UpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TbCustPointGoldCurrent2017UpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointGoldCurrent2017Payload>
          }
          aggregate: {
            args: Prisma.TbCustPointGoldCurrent2017AggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbCustPointGoldCurrent2017>
          }
          groupBy: {
            args: Prisma.TbCustPointGoldCurrent2017GroupByArgs<ExtArgs>
            result: $Utils.Optional<TbCustPointGoldCurrent2017GroupByOutputType>[]
          }
          count: {
            args: Prisma.TbCustPointGoldCurrent2017CountArgs<ExtArgs>
            result: $Utils.Optional<TbCustPointGoldCurrent2017CountAggregateOutputType> | number
          }
        }
      }
      TbCustPointSilverCashCurrent: {
        payload: Prisma.$TbCustPointSilverCashCurrentPayload<ExtArgs>
        fields: Prisma.TbCustPointSilverCashCurrentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TbCustPointSilverCashCurrentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCashCurrentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TbCustPointSilverCashCurrentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCashCurrentPayload>
          }
          findFirst: {
            args: Prisma.TbCustPointSilverCashCurrentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCashCurrentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TbCustPointSilverCashCurrentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCashCurrentPayload>
          }
          findMany: {
            args: Prisma.TbCustPointSilverCashCurrentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCashCurrentPayload>[]
          }
          create: {
            args: Prisma.TbCustPointSilverCashCurrentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCashCurrentPayload>
          }
          createMany: {
            args: Prisma.TbCustPointSilverCashCurrentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TbCustPointSilverCashCurrentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCashCurrentPayload>
          }
          update: {
            args: Prisma.TbCustPointSilverCashCurrentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCashCurrentPayload>
          }
          deleteMany: {
            args: Prisma.TbCustPointSilverCashCurrentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TbCustPointSilverCashCurrentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TbCustPointSilverCashCurrentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustPointSilverCashCurrentPayload>
          }
          aggregate: {
            args: Prisma.TbCustPointSilverCashCurrentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbCustPointSilverCashCurrent>
          }
          groupBy: {
            args: Prisma.TbCustPointSilverCashCurrentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbCustPointSilverCashCurrentGroupByOutputType>[]
          }
          count: {
            args: Prisma.TbCustPointSilverCashCurrentCountArgs<ExtArgs>
            result: $Utils.Optional<TbCustPointSilverCashCurrentCountAggregateOutputType> | number
          }
        }
      }
      TbCustGoldToAdjust: {
        payload: Prisma.$TbCustGoldToAdjustPayload<ExtArgs>
        fields: Prisma.TbCustGoldToAdjustFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TbCustGoldToAdjustFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustGoldToAdjustPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TbCustGoldToAdjustFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustGoldToAdjustPayload>
          }
          findFirst: {
            args: Prisma.TbCustGoldToAdjustFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustGoldToAdjustPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TbCustGoldToAdjustFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustGoldToAdjustPayload>
          }
          findMany: {
            args: Prisma.TbCustGoldToAdjustFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustGoldToAdjustPayload>[]
          }
          create: {
            args: Prisma.TbCustGoldToAdjustCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustGoldToAdjustPayload>
          }
          createMany: {
            args: Prisma.TbCustGoldToAdjustCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TbCustGoldToAdjustDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustGoldToAdjustPayload>
          }
          update: {
            args: Prisma.TbCustGoldToAdjustUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustGoldToAdjustPayload>
          }
          deleteMany: {
            args: Prisma.TbCustGoldToAdjustDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TbCustGoldToAdjustUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TbCustGoldToAdjustUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TbCustGoldToAdjustPayload>
          }
          aggregate: {
            args: Prisma.TbCustGoldToAdjustAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTbCustGoldToAdjust>
          }
          groupBy: {
            args: Prisma.TbCustGoldToAdjustGroupByArgs<ExtArgs>
            result: $Utils.Optional<TbCustGoldToAdjustGroupByOutputType>[]
          }
          count: {
            args: Prisma.TbCustGoldToAdjustCountArgs<ExtArgs>
            result: $Utils.Optional<TbCustGoldToAdjustCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    tbCustPointSilverCurrent2017?: TbCustPointSilverCurrent2017Omit
    tbCustPointGoldCurrent2017?: TbCustPointGoldCurrent2017Omit
    tbCustPointSilverCashCurrent?: TbCustPointSilverCashCurrentOmit
    tbCustGoldToAdjust?: TbCustGoldToAdjustOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model TbCustPointSilverCurrent2017
   */

  export type AggregateTbCustPointSilverCurrent2017 = {
    _count: TbCustPointSilverCurrent2017CountAggregateOutputType | null
    _avg: TbCustPointSilverCurrent2017AvgAggregateOutputType | null
    _sum: TbCustPointSilverCurrent2017SumAggregateOutputType | null
    _min: TbCustPointSilverCurrent2017MinAggregateOutputType | null
    _max: TbCustPointSilverCurrent2017MaxAggregateOutputType | null
  }

  export type TbCustPointSilverCurrent2017AvgAggregateOutputType = {
    itemId: number | null
    currentPoint: number | null
    xStatus: number | null
  }

  export type TbCustPointSilverCurrent2017SumAggregateOutputType = {
    itemId: number | null
    currentPoint: number | null
    xStatus: number | null
  }

  export type TbCustPointSilverCurrent2017MinAggregateOutputType = {
    itemId: number | null
    custId: string | null
    currentPoint: number | null
    xStatus: number | null
  }

  export type TbCustPointSilverCurrent2017MaxAggregateOutputType = {
    itemId: number | null
    custId: string | null
    currentPoint: number | null
    xStatus: number | null
  }

  export type TbCustPointSilverCurrent2017CountAggregateOutputType = {
    itemId: number
    custId: number
    currentPoint: number
    xStatus: number
    _all: number
  }


  export type TbCustPointSilverCurrent2017AvgAggregateInputType = {
    itemId?: true
    currentPoint?: true
    xStatus?: true
  }

  export type TbCustPointSilverCurrent2017SumAggregateInputType = {
    itemId?: true
    currentPoint?: true
    xStatus?: true
  }

  export type TbCustPointSilverCurrent2017MinAggregateInputType = {
    itemId?: true
    custId?: true
    currentPoint?: true
    xStatus?: true
  }

  export type TbCustPointSilverCurrent2017MaxAggregateInputType = {
    itemId?: true
    custId?: true
    currentPoint?: true
    xStatus?: true
  }

  export type TbCustPointSilverCurrent2017CountAggregateInputType = {
    itemId?: true
    custId?: true
    currentPoint?: true
    xStatus?: true
    _all?: true
  }

  export type TbCustPointSilverCurrent2017AggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TbCustPointSilverCurrent2017 to aggregate.
     */
    where?: TbCustPointSilverCurrent2017WhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointSilverCurrent2017s to fetch.
     */
    orderBy?: TbCustPointSilverCurrent2017OrderByWithRelationInput | TbCustPointSilverCurrent2017OrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TbCustPointSilverCurrent2017WhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointSilverCurrent2017s from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointSilverCurrent2017s.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TbCustPointSilverCurrent2017s
    **/
    _count?: true | TbCustPointSilverCurrent2017CountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TbCustPointSilverCurrent2017AvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TbCustPointSilverCurrent2017SumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbCustPointSilverCurrent2017MinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbCustPointSilverCurrent2017MaxAggregateInputType
  }

  export type GetTbCustPointSilverCurrent2017AggregateType<T extends TbCustPointSilverCurrent2017AggregateArgs> = {
        [P in keyof T & keyof AggregateTbCustPointSilverCurrent2017]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbCustPointSilverCurrent2017[P]>
      : GetScalarType<T[P], AggregateTbCustPointSilverCurrent2017[P]>
  }




  export type TbCustPointSilverCurrent2017GroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TbCustPointSilverCurrent2017WhereInput
    orderBy?: TbCustPointSilverCurrent2017OrderByWithAggregationInput | TbCustPointSilverCurrent2017OrderByWithAggregationInput[]
    by: TbCustPointSilverCurrent2017ScalarFieldEnum[] | TbCustPointSilverCurrent2017ScalarFieldEnum
    having?: TbCustPointSilverCurrent2017ScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbCustPointSilverCurrent2017CountAggregateInputType | true
    _avg?: TbCustPointSilverCurrent2017AvgAggregateInputType
    _sum?: TbCustPointSilverCurrent2017SumAggregateInputType
    _min?: TbCustPointSilverCurrent2017MinAggregateInputType
    _max?: TbCustPointSilverCurrent2017MaxAggregateInputType
  }

  export type TbCustPointSilverCurrent2017GroupByOutputType = {
    itemId: number
    custId: string | null
    currentPoint: number | null
    xStatus: number | null
    _count: TbCustPointSilverCurrent2017CountAggregateOutputType | null
    _avg: TbCustPointSilverCurrent2017AvgAggregateOutputType | null
    _sum: TbCustPointSilverCurrent2017SumAggregateOutputType | null
    _min: TbCustPointSilverCurrent2017MinAggregateOutputType | null
    _max: TbCustPointSilverCurrent2017MaxAggregateOutputType | null
  }

  type GetTbCustPointSilverCurrent2017GroupByPayload<T extends TbCustPointSilverCurrent2017GroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbCustPointSilverCurrent2017GroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbCustPointSilverCurrent2017GroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbCustPointSilverCurrent2017GroupByOutputType[P]>
            : GetScalarType<T[P], TbCustPointSilverCurrent2017GroupByOutputType[P]>
        }
      >
    >


  export type TbCustPointSilverCurrent2017Select<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    itemId?: boolean
    custId?: boolean
    currentPoint?: boolean
    xStatus?: boolean
  }, ExtArgs["result"]["tbCustPointSilverCurrent2017"]>



  export type TbCustPointSilverCurrent2017SelectScalar = {
    itemId?: boolean
    custId?: boolean
    currentPoint?: boolean
    xStatus?: boolean
  }

  export type TbCustPointSilverCurrent2017Omit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"itemId" | "custId" | "currentPoint" | "xStatus", ExtArgs["result"]["tbCustPointSilverCurrent2017"]>

  export type $TbCustPointSilverCurrent2017Payload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TbCustPointSilverCurrent2017"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      itemId: number
      custId: string | null
      currentPoint: number | null
      xStatus: number | null
    }, ExtArgs["result"]["tbCustPointSilverCurrent2017"]>
    composites: {}
  }

  type TbCustPointSilverCurrent2017GetPayload<S extends boolean | null | undefined | TbCustPointSilverCurrent2017DefaultArgs> = $Result.GetResult<Prisma.$TbCustPointSilverCurrent2017Payload, S>

  type TbCustPointSilverCurrent2017CountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TbCustPointSilverCurrent2017FindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbCustPointSilverCurrent2017CountAggregateInputType | true
    }

  export interface TbCustPointSilverCurrent2017Delegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TbCustPointSilverCurrent2017'], meta: { name: 'TbCustPointSilverCurrent2017' } }
    /**
     * Find zero or one TbCustPointSilverCurrent2017 that matches the filter.
     * @param {TbCustPointSilverCurrent2017FindUniqueArgs} args - Arguments to find a TbCustPointSilverCurrent2017
     * @example
     * // Get one TbCustPointSilverCurrent2017
     * const tbCustPointSilverCurrent2017 = await prisma.tbCustPointSilverCurrent2017.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TbCustPointSilverCurrent2017FindUniqueArgs>(args: SelectSubset<T, TbCustPointSilverCurrent2017FindUniqueArgs<ExtArgs>>): Prisma__TbCustPointSilverCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointSilverCurrent2017Payload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbCustPointSilverCurrent2017 that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TbCustPointSilverCurrent2017FindUniqueOrThrowArgs} args - Arguments to find a TbCustPointSilverCurrent2017
     * @example
     * // Get one TbCustPointSilverCurrent2017
     * const tbCustPointSilverCurrent2017 = await prisma.tbCustPointSilverCurrent2017.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TbCustPointSilverCurrent2017FindUniqueOrThrowArgs>(args: SelectSubset<T, TbCustPointSilverCurrent2017FindUniqueOrThrowArgs<ExtArgs>>): Prisma__TbCustPointSilverCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointSilverCurrent2017Payload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCustPointSilverCurrent2017 that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCurrent2017FindFirstArgs} args - Arguments to find a TbCustPointSilverCurrent2017
     * @example
     * // Get one TbCustPointSilverCurrent2017
     * const tbCustPointSilverCurrent2017 = await prisma.tbCustPointSilverCurrent2017.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TbCustPointSilverCurrent2017FindFirstArgs>(args?: SelectSubset<T, TbCustPointSilverCurrent2017FindFirstArgs<ExtArgs>>): Prisma__TbCustPointSilverCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointSilverCurrent2017Payload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCustPointSilverCurrent2017 that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCurrent2017FindFirstOrThrowArgs} args - Arguments to find a TbCustPointSilverCurrent2017
     * @example
     * // Get one TbCustPointSilverCurrent2017
     * const tbCustPointSilverCurrent2017 = await prisma.tbCustPointSilverCurrent2017.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TbCustPointSilverCurrent2017FindFirstOrThrowArgs>(args?: SelectSubset<T, TbCustPointSilverCurrent2017FindFirstOrThrowArgs<ExtArgs>>): Prisma__TbCustPointSilverCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointSilverCurrent2017Payload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbCustPointSilverCurrent2017s that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCurrent2017FindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbCustPointSilverCurrent2017s
     * const tbCustPointSilverCurrent2017s = await prisma.tbCustPointSilverCurrent2017.findMany()
     * 
     * // Get first 10 TbCustPointSilverCurrent2017s
     * const tbCustPointSilverCurrent2017s = await prisma.tbCustPointSilverCurrent2017.findMany({ take: 10 })
     * 
     * // Only select the `itemId`
     * const tbCustPointSilverCurrent2017WithItemIdOnly = await prisma.tbCustPointSilverCurrent2017.findMany({ select: { itemId: true } })
     * 
     */
    findMany<T extends TbCustPointSilverCurrent2017FindManyArgs>(args?: SelectSubset<T, TbCustPointSilverCurrent2017FindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TbCustPointSilverCurrent2017Payload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbCustPointSilverCurrent2017.
     * @param {TbCustPointSilverCurrent2017CreateArgs} args - Arguments to create a TbCustPointSilverCurrent2017.
     * @example
     * // Create one TbCustPointSilverCurrent2017
     * const TbCustPointSilverCurrent2017 = await prisma.tbCustPointSilverCurrent2017.create({
     *   data: {
     *     // ... data to create a TbCustPointSilverCurrent2017
     *   }
     * })
     * 
     */
    create<T extends TbCustPointSilverCurrent2017CreateArgs>(args: SelectSubset<T, TbCustPointSilverCurrent2017CreateArgs<ExtArgs>>): Prisma__TbCustPointSilverCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointSilverCurrent2017Payload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbCustPointSilverCurrent2017s.
     * @param {TbCustPointSilverCurrent2017CreateManyArgs} args - Arguments to create many TbCustPointSilverCurrent2017s.
     * @example
     * // Create many TbCustPointSilverCurrent2017s
     * const tbCustPointSilverCurrent2017 = await prisma.tbCustPointSilverCurrent2017.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TbCustPointSilverCurrent2017CreateManyArgs>(args?: SelectSubset<T, TbCustPointSilverCurrent2017CreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TbCustPointSilverCurrent2017.
     * @param {TbCustPointSilverCurrent2017DeleteArgs} args - Arguments to delete one TbCustPointSilverCurrent2017.
     * @example
     * // Delete one TbCustPointSilverCurrent2017
     * const TbCustPointSilverCurrent2017 = await prisma.tbCustPointSilverCurrent2017.delete({
     *   where: {
     *     // ... filter to delete one TbCustPointSilverCurrent2017
     *   }
     * })
     * 
     */
    delete<T extends TbCustPointSilverCurrent2017DeleteArgs>(args: SelectSubset<T, TbCustPointSilverCurrent2017DeleteArgs<ExtArgs>>): Prisma__TbCustPointSilverCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointSilverCurrent2017Payload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbCustPointSilverCurrent2017.
     * @param {TbCustPointSilverCurrent2017UpdateArgs} args - Arguments to update one TbCustPointSilverCurrent2017.
     * @example
     * // Update one TbCustPointSilverCurrent2017
     * const tbCustPointSilverCurrent2017 = await prisma.tbCustPointSilverCurrent2017.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TbCustPointSilverCurrent2017UpdateArgs>(args: SelectSubset<T, TbCustPointSilverCurrent2017UpdateArgs<ExtArgs>>): Prisma__TbCustPointSilverCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointSilverCurrent2017Payload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbCustPointSilverCurrent2017s.
     * @param {TbCustPointSilverCurrent2017DeleteManyArgs} args - Arguments to filter TbCustPointSilverCurrent2017s to delete.
     * @example
     * // Delete a few TbCustPointSilverCurrent2017s
     * const { count } = await prisma.tbCustPointSilverCurrent2017.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TbCustPointSilverCurrent2017DeleteManyArgs>(args?: SelectSubset<T, TbCustPointSilverCurrent2017DeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbCustPointSilverCurrent2017s.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCurrent2017UpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbCustPointSilverCurrent2017s
     * const tbCustPointSilverCurrent2017 = await prisma.tbCustPointSilverCurrent2017.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TbCustPointSilverCurrent2017UpdateManyArgs>(args: SelectSubset<T, TbCustPointSilverCurrent2017UpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TbCustPointSilverCurrent2017.
     * @param {TbCustPointSilverCurrent2017UpsertArgs} args - Arguments to update or create a TbCustPointSilverCurrent2017.
     * @example
     * // Update or create a TbCustPointSilverCurrent2017
     * const tbCustPointSilverCurrent2017 = await prisma.tbCustPointSilverCurrent2017.upsert({
     *   create: {
     *     // ... data to create a TbCustPointSilverCurrent2017
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbCustPointSilverCurrent2017 we want to update
     *   }
     * })
     */
    upsert<T extends TbCustPointSilverCurrent2017UpsertArgs>(args: SelectSubset<T, TbCustPointSilverCurrent2017UpsertArgs<ExtArgs>>): Prisma__TbCustPointSilverCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointSilverCurrent2017Payload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbCustPointSilverCurrent2017s.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCurrent2017CountArgs} args - Arguments to filter TbCustPointSilverCurrent2017s to count.
     * @example
     * // Count the number of TbCustPointSilverCurrent2017s
     * const count = await prisma.tbCustPointSilverCurrent2017.count({
     *   where: {
     *     // ... the filter for the TbCustPointSilverCurrent2017s we want to count
     *   }
     * })
    **/
    count<T extends TbCustPointSilverCurrent2017CountArgs>(
      args?: Subset<T, TbCustPointSilverCurrent2017CountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbCustPointSilverCurrent2017CountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbCustPointSilverCurrent2017.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCurrent2017AggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbCustPointSilverCurrent2017AggregateArgs>(args: Subset<T, TbCustPointSilverCurrent2017AggregateArgs>): Prisma.PrismaPromise<GetTbCustPointSilverCurrent2017AggregateType<T>>

    /**
     * Group by TbCustPointSilverCurrent2017.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCurrent2017GroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TbCustPointSilverCurrent2017GroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TbCustPointSilverCurrent2017GroupByArgs['orderBy'] }
        : { orderBy?: TbCustPointSilverCurrent2017GroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TbCustPointSilverCurrent2017GroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbCustPointSilverCurrent2017GroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TbCustPointSilverCurrent2017 model
   */
  readonly fields: TbCustPointSilverCurrent2017FieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TbCustPointSilverCurrent2017.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TbCustPointSilverCurrent2017Client<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TbCustPointSilverCurrent2017 model
   */
  interface TbCustPointSilverCurrent2017FieldRefs {
    readonly itemId: FieldRef<"TbCustPointSilverCurrent2017", 'Int'>
    readonly custId: FieldRef<"TbCustPointSilverCurrent2017", 'String'>
    readonly currentPoint: FieldRef<"TbCustPointSilverCurrent2017", 'Float'>
    readonly xStatus: FieldRef<"TbCustPointSilverCurrent2017", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * TbCustPointSilverCurrent2017 findUnique
   */
  export type TbCustPointSilverCurrent2017FindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCurrent2017
     */
    select?: TbCustPointSilverCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCurrent2017
     */
    omit?: TbCustPointSilverCurrent2017Omit<ExtArgs> | null
    /**
     * Filter, which TbCustPointSilverCurrent2017 to fetch.
     */
    where: TbCustPointSilverCurrent2017WhereUniqueInput
  }

  /**
   * TbCustPointSilverCurrent2017 findUniqueOrThrow
   */
  export type TbCustPointSilverCurrent2017FindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCurrent2017
     */
    select?: TbCustPointSilverCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCurrent2017
     */
    omit?: TbCustPointSilverCurrent2017Omit<ExtArgs> | null
    /**
     * Filter, which TbCustPointSilverCurrent2017 to fetch.
     */
    where: TbCustPointSilverCurrent2017WhereUniqueInput
  }

  /**
   * TbCustPointSilverCurrent2017 findFirst
   */
  export type TbCustPointSilverCurrent2017FindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCurrent2017
     */
    select?: TbCustPointSilverCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCurrent2017
     */
    omit?: TbCustPointSilverCurrent2017Omit<ExtArgs> | null
    /**
     * Filter, which TbCustPointSilverCurrent2017 to fetch.
     */
    where?: TbCustPointSilverCurrent2017WhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointSilverCurrent2017s to fetch.
     */
    orderBy?: TbCustPointSilverCurrent2017OrderByWithRelationInput | TbCustPointSilverCurrent2017OrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TbCustPointSilverCurrent2017s.
     */
    cursor?: TbCustPointSilverCurrent2017WhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointSilverCurrent2017s from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointSilverCurrent2017s.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustPointSilverCurrent2017s.
     */
    distinct?: TbCustPointSilverCurrent2017ScalarFieldEnum | TbCustPointSilverCurrent2017ScalarFieldEnum[]
  }

  /**
   * TbCustPointSilverCurrent2017 findFirstOrThrow
   */
  export type TbCustPointSilverCurrent2017FindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCurrent2017
     */
    select?: TbCustPointSilverCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCurrent2017
     */
    omit?: TbCustPointSilverCurrent2017Omit<ExtArgs> | null
    /**
     * Filter, which TbCustPointSilverCurrent2017 to fetch.
     */
    where?: TbCustPointSilverCurrent2017WhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointSilverCurrent2017s to fetch.
     */
    orderBy?: TbCustPointSilverCurrent2017OrderByWithRelationInput | TbCustPointSilverCurrent2017OrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TbCustPointSilverCurrent2017s.
     */
    cursor?: TbCustPointSilverCurrent2017WhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointSilverCurrent2017s from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointSilverCurrent2017s.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustPointSilverCurrent2017s.
     */
    distinct?: TbCustPointSilverCurrent2017ScalarFieldEnum | TbCustPointSilverCurrent2017ScalarFieldEnum[]
  }

  /**
   * TbCustPointSilverCurrent2017 findMany
   */
  export type TbCustPointSilverCurrent2017FindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCurrent2017
     */
    select?: TbCustPointSilverCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCurrent2017
     */
    omit?: TbCustPointSilverCurrent2017Omit<ExtArgs> | null
    /**
     * Filter, which TbCustPointSilverCurrent2017s to fetch.
     */
    where?: TbCustPointSilverCurrent2017WhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointSilverCurrent2017s to fetch.
     */
    orderBy?: TbCustPointSilverCurrent2017OrderByWithRelationInput | TbCustPointSilverCurrent2017OrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TbCustPointSilverCurrent2017s.
     */
    cursor?: TbCustPointSilverCurrent2017WhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointSilverCurrent2017s from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointSilverCurrent2017s.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustPointSilverCurrent2017s.
     */
    distinct?: TbCustPointSilverCurrent2017ScalarFieldEnum | TbCustPointSilverCurrent2017ScalarFieldEnum[]
  }

  /**
   * TbCustPointSilverCurrent2017 create
   */
  export type TbCustPointSilverCurrent2017CreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCurrent2017
     */
    select?: TbCustPointSilverCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCurrent2017
     */
    omit?: TbCustPointSilverCurrent2017Omit<ExtArgs> | null
    /**
     * The data needed to create a TbCustPointSilverCurrent2017.
     */
    data?: XOR<TbCustPointSilverCurrent2017CreateInput, TbCustPointSilverCurrent2017UncheckedCreateInput>
  }

  /**
   * TbCustPointSilverCurrent2017 createMany
   */
  export type TbCustPointSilverCurrent2017CreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TbCustPointSilverCurrent2017s.
     */
    data: TbCustPointSilverCurrent2017CreateManyInput | TbCustPointSilverCurrent2017CreateManyInput[]
  }

  /**
   * TbCustPointSilverCurrent2017 update
   */
  export type TbCustPointSilverCurrent2017UpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCurrent2017
     */
    select?: TbCustPointSilverCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCurrent2017
     */
    omit?: TbCustPointSilverCurrent2017Omit<ExtArgs> | null
    /**
     * The data needed to update a TbCustPointSilverCurrent2017.
     */
    data: XOR<TbCustPointSilverCurrent2017UpdateInput, TbCustPointSilverCurrent2017UncheckedUpdateInput>
    /**
     * Choose, which TbCustPointSilverCurrent2017 to update.
     */
    where: TbCustPointSilverCurrent2017WhereUniqueInput
  }

  /**
   * TbCustPointSilverCurrent2017 updateMany
   */
  export type TbCustPointSilverCurrent2017UpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TbCustPointSilverCurrent2017s.
     */
    data: XOR<TbCustPointSilverCurrent2017UpdateManyMutationInput, TbCustPointSilverCurrent2017UncheckedUpdateManyInput>
    /**
     * Filter which TbCustPointSilverCurrent2017s to update
     */
    where?: TbCustPointSilverCurrent2017WhereInput
    /**
     * Limit how many TbCustPointSilverCurrent2017s to update.
     */
    limit?: number
  }

  /**
   * TbCustPointSilverCurrent2017 upsert
   */
  export type TbCustPointSilverCurrent2017UpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCurrent2017
     */
    select?: TbCustPointSilverCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCurrent2017
     */
    omit?: TbCustPointSilverCurrent2017Omit<ExtArgs> | null
    /**
     * The filter to search for the TbCustPointSilverCurrent2017 to update in case it exists.
     */
    where: TbCustPointSilverCurrent2017WhereUniqueInput
    /**
     * In case the TbCustPointSilverCurrent2017 found by the `where` argument doesn't exist, create a new TbCustPointSilverCurrent2017 with this data.
     */
    create: XOR<TbCustPointSilverCurrent2017CreateInput, TbCustPointSilverCurrent2017UncheckedCreateInput>
    /**
     * In case the TbCustPointSilverCurrent2017 was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TbCustPointSilverCurrent2017UpdateInput, TbCustPointSilverCurrent2017UncheckedUpdateInput>
  }

  /**
   * TbCustPointSilverCurrent2017 delete
   */
  export type TbCustPointSilverCurrent2017DeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCurrent2017
     */
    select?: TbCustPointSilverCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCurrent2017
     */
    omit?: TbCustPointSilverCurrent2017Omit<ExtArgs> | null
    /**
     * Filter which TbCustPointSilverCurrent2017 to delete.
     */
    where: TbCustPointSilverCurrent2017WhereUniqueInput
  }

  /**
   * TbCustPointSilverCurrent2017 deleteMany
   */
  export type TbCustPointSilverCurrent2017DeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TbCustPointSilverCurrent2017s to delete
     */
    where?: TbCustPointSilverCurrent2017WhereInput
    /**
     * Limit how many TbCustPointSilverCurrent2017s to delete.
     */
    limit?: number
  }

  /**
   * TbCustPointSilverCurrent2017 without action
   */
  export type TbCustPointSilverCurrent2017DefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCurrent2017
     */
    select?: TbCustPointSilverCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCurrent2017
     */
    omit?: TbCustPointSilverCurrent2017Omit<ExtArgs> | null
  }


  /**
   * Model TbCustPointGoldCurrent2017
   */

  export type AggregateTbCustPointGoldCurrent2017 = {
    _count: TbCustPointGoldCurrent2017CountAggregateOutputType | null
    _avg: TbCustPointGoldCurrent2017AvgAggregateOutputType | null
    _sum: TbCustPointGoldCurrent2017SumAggregateOutputType | null
    _min: TbCustPointGoldCurrent2017MinAggregateOutputType | null
    _max: TbCustPointGoldCurrent2017MaxAggregateOutputType | null
  }

  export type TbCustPointGoldCurrent2017AvgAggregateOutputType = {
    itemId: number | null
    currentPoint: number | null
    unfundedPoint: number | null
    xStatus: number | null
  }

  export type TbCustPointGoldCurrent2017SumAggregateOutputType = {
    itemId: number | null
    currentPoint: number | null
    unfundedPoint: number | null
    xStatus: number | null
  }

  export type TbCustPointGoldCurrent2017MinAggregateOutputType = {
    itemId: number | null
    custId: string | null
    currentPoint: number | null
    unfundedPoint: number | null
    xStatus: number | null
  }

  export type TbCustPointGoldCurrent2017MaxAggregateOutputType = {
    itemId: number | null
    custId: string | null
    currentPoint: number | null
    unfundedPoint: number | null
    xStatus: number | null
  }

  export type TbCustPointGoldCurrent2017CountAggregateOutputType = {
    itemId: number
    custId: number
    currentPoint: number
    unfundedPoint: number
    xStatus: number
    _all: number
  }


  export type TbCustPointGoldCurrent2017AvgAggregateInputType = {
    itemId?: true
    currentPoint?: true
    unfundedPoint?: true
    xStatus?: true
  }

  export type TbCustPointGoldCurrent2017SumAggregateInputType = {
    itemId?: true
    currentPoint?: true
    unfundedPoint?: true
    xStatus?: true
  }

  export type TbCustPointGoldCurrent2017MinAggregateInputType = {
    itemId?: true
    custId?: true
    currentPoint?: true
    unfundedPoint?: true
    xStatus?: true
  }

  export type TbCustPointGoldCurrent2017MaxAggregateInputType = {
    itemId?: true
    custId?: true
    currentPoint?: true
    unfundedPoint?: true
    xStatus?: true
  }

  export type TbCustPointGoldCurrent2017CountAggregateInputType = {
    itemId?: true
    custId?: true
    currentPoint?: true
    unfundedPoint?: true
    xStatus?: true
    _all?: true
  }

  export type TbCustPointGoldCurrent2017AggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TbCustPointGoldCurrent2017 to aggregate.
     */
    where?: TbCustPointGoldCurrent2017WhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointGoldCurrent2017s to fetch.
     */
    orderBy?: TbCustPointGoldCurrent2017OrderByWithRelationInput | TbCustPointGoldCurrent2017OrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TbCustPointGoldCurrent2017WhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointGoldCurrent2017s from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointGoldCurrent2017s.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TbCustPointGoldCurrent2017s
    **/
    _count?: true | TbCustPointGoldCurrent2017CountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TbCustPointGoldCurrent2017AvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TbCustPointGoldCurrent2017SumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbCustPointGoldCurrent2017MinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbCustPointGoldCurrent2017MaxAggregateInputType
  }

  export type GetTbCustPointGoldCurrent2017AggregateType<T extends TbCustPointGoldCurrent2017AggregateArgs> = {
        [P in keyof T & keyof AggregateTbCustPointGoldCurrent2017]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbCustPointGoldCurrent2017[P]>
      : GetScalarType<T[P], AggregateTbCustPointGoldCurrent2017[P]>
  }




  export type TbCustPointGoldCurrent2017GroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TbCustPointGoldCurrent2017WhereInput
    orderBy?: TbCustPointGoldCurrent2017OrderByWithAggregationInput | TbCustPointGoldCurrent2017OrderByWithAggregationInput[]
    by: TbCustPointGoldCurrent2017ScalarFieldEnum[] | TbCustPointGoldCurrent2017ScalarFieldEnum
    having?: TbCustPointGoldCurrent2017ScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbCustPointGoldCurrent2017CountAggregateInputType | true
    _avg?: TbCustPointGoldCurrent2017AvgAggregateInputType
    _sum?: TbCustPointGoldCurrent2017SumAggregateInputType
    _min?: TbCustPointGoldCurrent2017MinAggregateInputType
    _max?: TbCustPointGoldCurrent2017MaxAggregateInputType
  }

  export type TbCustPointGoldCurrent2017GroupByOutputType = {
    itemId: number
    custId: string | null
    currentPoint: number | null
    unfundedPoint: number | null
    xStatus: number | null
    _count: TbCustPointGoldCurrent2017CountAggregateOutputType | null
    _avg: TbCustPointGoldCurrent2017AvgAggregateOutputType | null
    _sum: TbCustPointGoldCurrent2017SumAggregateOutputType | null
    _min: TbCustPointGoldCurrent2017MinAggregateOutputType | null
    _max: TbCustPointGoldCurrent2017MaxAggregateOutputType | null
  }

  type GetTbCustPointGoldCurrent2017GroupByPayload<T extends TbCustPointGoldCurrent2017GroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbCustPointGoldCurrent2017GroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbCustPointGoldCurrent2017GroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbCustPointGoldCurrent2017GroupByOutputType[P]>
            : GetScalarType<T[P], TbCustPointGoldCurrent2017GroupByOutputType[P]>
        }
      >
    >


  export type TbCustPointGoldCurrent2017Select<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    itemId?: boolean
    custId?: boolean
    currentPoint?: boolean
    unfundedPoint?: boolean
    xStatus?: boolean
  }, ExtArgs["result"]["tbCustPointGoldCurrent2017"]>



  export type TbCustPointGoldCurrent2017SelectScalar = {
    itemId?: boolean
    custId?: boolean
    currentPoint?: boolean
    unfundedPoint?: boolean
    xStatus?: boolean
  }

  export type TbCustPointGoldCurrent2017Omit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"itemId" | "custId" | "currentPoint" | "unfundedPoint" | "xStatus", ExtArgs["result"]["tbCustPointGoldCurrent2017"]>

  export type $TbCustPointGoldCurrent2017Payload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TbCustPointGoldCurrent2017"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      itemId: number
      custId: string | null
      currentPoint: number | null
      unfundedPoint: number | null
      xStatus: number | null
    }, ExtArgs["result"]["tbCustPointGoldCurrent2017"]>
    composites: {}
  }

  type TbCustPointGoldCurrent2017GetPayload<S extends boolean | null | undefined | TbCustPointGoldCurrent2017DefaultArgs> = $Result.GetResult<Prisma.$TbCustPointGoldCurrent2017Payload, S>

  type TbCustPointGoldCurrent2017CountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TbCustPointGoldCurrent2017FindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbCustPointGoldCurrent2017CountAggregateInputType | true
    }

  export interface TbCustPointGoldCurrent2017Delegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TbCustPointGoldCurrent2017'], meta: { name: 'TbCustPointGoldCurrent2017' } }
    /**
     * Find zero or one TbCustPointGoldCurrent2017 that matches the filter.
     * @param {TbCustPointGoldCurrent2017FindUniqueArgs} args - Arguments to find a TbCustPointGoldCurrent2017
     * @example
     * // Get one TbCustPointGoldCurrent2017
     * const tbCustPointGoldCurrent2017 = await prisma.tbCustPointGoldCurrent2017.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TbCustPointGoldCurrent2017FindUniqueArgs>(args: SelectSubset<T, TbCustPointGoldCurrent2017FindUniqueArgs<ExtArgs>>): Prisma__TbCustPointGoldCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointGoldCurrent2017Payload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbCustPointGoldCurrent2017 that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TbCustPointGoldCurrent2017FindUniqueOrThrowArgs} args - Arguments to find a TbCustPointGoldCurrent2017
     * @example
     * // Get one TbCustPointGoldCurrent2017
     * const tbCustPointGoldCurrent2017 = await prisma.tbCustPointGoldCurrent2017.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TbCustPointGoldCurrent2017FindUniqueOrThrowArgs>(args: SelectSubset<T, TbCustPointGoldCurrent2017FindUniqueOrThrowArgs<ExtArgs>>): Prisma__TbCustPointGoldCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointGoldCurrent2017Payload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCustPointGoldCurrent2017 that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointGoldCurrent2017FindFirstArgs} args - Arguments to find a TbCustPointGoldCurrent2017
     * @example
     * // Get one TbCustPointGoldCurrent2017
     * const tbCustPointGoldCurrent2017 = await prisma.tbCustPointGoldCurrent2017.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TbCustPointGoldCurrent2017FindFirstArgs>(args?: SelectSubset<T, TbCustPointGoldCurrent2017FindFirstArgs<ExtArgs>>): Prisma__TbCustPointGoldCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointGoldCurrent2017Payload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCustPointGoldCurrent2017 that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointGoldCurrent2017FindFirstOrThrowArgs} args - Arguments to find a TbCustPointGoldCurrent2017
     * @example
     * // Get one TbCustPointGoldCurrent2017
     * const tbCustPointGoldCurrent2017 = await prisma.tbCustPointGoldCurrent2017.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TbCustPointGoldCurrent2017FindFirstOrThrowArgs>(args?: SelectSubset<T, TbCustPointGoldCurrent2017FindFirstOrThrowArgs<ExtArgs>>): Prisma__TbCustPointGoldCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointGoldCurrent2017Payload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbCustPointGoldCurrent2017s that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointGoldCurrent2017FindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbCustPointGoldCurrent2017s
     * const tbCustPointGoldCurrent2017s = await prisma.tbCustPointGoldCurrent2017.findMany()
     * 
     * // Get first 10 TbCustPointGoldCurrent2017s
     * const tbCustPointGoldCurrent2017s = await prisma.tbCustPointGoldCurrent2017.findMany({ take: 10 })
     * 
     * // Only select the `itemId`
     * const tbCustPointGoldCurrent2017WithItemIdOnly = await prisma.tbCustPointGoldCurrent2017.findMany({ select: { itemId: true } })
     * 
     */
    findMany<T extends TbCustPointGoldCurrent2017FindManyArgs>(args?: SelectSubset<T, TbCustPointGoldCurrent2017FindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TbCustPointGoldCurrent2017Payload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbCustPointGoldCurrent2017.
     * @param {TbCustPointGoldCurrent2017CreateArgs} args - Arguments to create a TbCustPointGoldCurrent2017.
     * @example
     * // Create one TbCustPointGoldCurrent2017
     * const TbCustPointGoldCurrent2017 = await prisma.tbCustPointGoldCurrent2017.create({
     *   data: {
     *     // ... data to create a TbCustPointGoldCurrent2017
     *   }
     * })
     * 
     */
    create<T extends TbCustPointGoldCurrent2017CreateArgs>(args: SelectSubset<T, TbCustPointGoldCurrent2017CreateArgs<ExtArgs>>): Prisma__TbCustPointGoldCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointGoldCurrent2017Payload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbCustPointGoldCurrent2017s.
     * @param {TbCustPointGoldCurrent2017CreateManyArgs} args - Arguments to create many TbCustPointGoldCurrent2017s.
     * @example
     * // Create many TbCustPointGoldCurrent2017s
     * const tbCustPointGoldCurrent2017 = await prisma.tbCustPointGoldCurrent2017.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TbCustPointGoldCurrent2017CreateManyArgs>(args?: SelectSubset<T, TbCustPointGoldCurrent2017CreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TbCustPointGoldCurrent2017.
     * @param {TbCustPointGoldCurrent2017DeleteArgs} args - Arguments to delete one TbCustPointGoldCurrent2017.
     * @example
     * // Delete one TbCustPointGoldCurrent2017
     * const TbCustPointGoldCurrent2017 = await prisma.tbCustPointGoldCurrent2017.delete({
     *   where: {
     *     // ... filter to delete one TbCustPointGoldCurrent2017
     *   }
     * })
     * 
     */
    delete<T extends TbCustPointGoldCurrent2017DeleteArgs>(args: SelectSubset<T, TbCustPointGoldCurrent2017DeleteArgs<ExtArgs>>): Prisma__TbCustPointGoldCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointGoldCurrent2017Payload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbCustPointGoldCurrent2017.
     * @param {TbCustPointGoldCurrent2017UpdateArgs} args - Arguments to update one TbCustPointGoldCurrent2017.
     * @example
     * // Update one TbCustPointGoldCurrent2017
     * const tbCustPointGoldCurrent2017 = await prisma.tbCustPointGoldCurrent2017.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TbCustPointGoldCurrent2017UpdateArgs>(args: SelectSubset<T, TbCustPointGoldCurrent2017UpdateArgs<ExtArgs>>): Prisma__TbCustPointGoldCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointGoldCurrent2017Payload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbCustPointGoldCurrent2017s.
     * @param {TbCustPointGoldCurrent2017DeleteManyArgs} args - Arguments to filter TbCustPointGoldCurrent2017s to delete.
     * @example
     * // Delete a few TbCustPointGoldCurrent2017s
     * const { count } = await prisma.tbCustPointGoldCurrent2017.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TbCustPointGoldCurrent2017DeleteManyArgs>(args?: SelectSubset<T, TbCustPointGoldCurrent2017DeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbCustPointGoldCurrent2017s.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointGoldCurrent2017UpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbCustPointGoldCurrent2017s
     * const tbCustPointGoldCurrent2017 = await prisma.tbCustPointGoldCurrent2017.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TbCustPointGoldCurrent2017UpdateManyArgs>(args: SelectSubset<T, TbCustPointGoldCurrent2017UpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TbCustPointGoldCurrent2017.
     * @param {TbCustPointGoldCurrent2017UpsertArgs} args - Arguments to update or create a TbCustPointGoldCurrent2017.
     * @example
     * // Update or create a TbCustPointGoldCurrent2017
     * const tbCustPointGoldCurrent2017 = await prisma.tbCustPointGoldCurrent2017.upsert({
     *   create: {
     *     // ... data to create a TbCustPointGoldCurrent2017
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbCustPointGoldCurrent2017 we want to update
     *   }
     * })
     */
    upsert<T extends TbCustPointGoldCurrent2017UpsertArgs>(args: SelectSubset<T, TbCustPointGoldCurrent2017UpsertArgs<ExtArgs>>): Prisma__TbCustPointGoldCurrent2017Client<$Result.GetResult<Prisma.$TbCustPointGoldCurrent2017Payload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbCustPointGoldCurrent2017s.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointGoldCurrent2017CountArgs} args - Arguments to filter TbCustPointGoldCurrent2017s to count.
     * @example
     * // Count the number of TbCustPointGoldCurrent2017s
     * const count = await prisma.tbCustPointGoldCurrent2017.count({
     *   where: {
     *     // ... the filter for the TbCustPointGoldCurrent2017s we want to count
     *   }
     * })
    **/
    count<T extends TbCustPointGoldCurrent2017CountArgs>(
      args?: Subset<T, TbCustPointGoldCurrent2017CountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbCustPointGoldCurrent2017CountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbCustPointGoldCurrent2017.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointGoldCurrent2017AggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbCustPointGoldCurrent2017AggregateArgs>(args: Subset<T, TbCustPointGoldCurrent2017AggregateArgs>): Prisma.PrismaPromise<GetTbCustPointGoldCurrent2017AggregateType<T>>

    /**
     * Group by TbCustPointGoldCurrent2017.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointGoldCurrent2017GroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TbCustPointGoldCurrent2017GroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TbCustPointGoldCurrent2017GroupByArgs['orderBy'] }
        : { orderBy?: TbCustPointGoldCurrent2017GroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TbCustPointGoldCurrent2017GroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbCustPointGoldCurrent2017GroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TbCustPointGoldCurrent2017 model
   */
  readonly fields: TbCustPointGoldCurrent2017FieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TbCustPointGoldCurrent2017.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TbCustPointGoldCurrent2017Client<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TbCustPointGoldCurrent2017 model
   */
  interface TbCustPointGoldCurrent2017FieldRefs {
    readonly itemId: FieldRef<"TbCustPointGoldCurrent2017", 'Int'>
    readonly custId: FieldRef<"TbCustPointGoldCurrent2017", 'String'>
    readonly currentPoint: FieldRef<"TbCustPointGoldCurrent2017", 'Float'>
    readonly unfundedPoint: FieldRef<"TbCustPointGoldCurrent2017", 'Float'>
    readonly xStatus: FieldRef<"TbCustPointGoldCurrent2017", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * TbCustPointGoldCurrent2017 findUnique
   */
  export type TbCustPointGoldCurrent2017FindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointGoldCurrent2017
     */
    select?: TbCustPointGoldCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointGoldCurrent2017
     */
    omit?: TbCustPointGoldCurrent2017Omit<ExtArgs> | null
    /**
     * Filter, which TbCustPointGoldCurrent2017 to fetch.
     */
    where: TbCustPointGoldCurrent2017WhereUniqueInput
  }

  /**
   * TbCustPointGoldCurrent2017 findUniqueOrThrow
   */
  export type TbCustPointGoldCurrent2017FindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointGoldCurrent2017
     */
    select?: TbCustPointGoldCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointGoldCurrent2017
     */
    omit?: TbCustPointGoldCurrent2017Omit<ExtArgs> | null
    /**
     * Filter, which TbCustPointGoldCurrent2017 to fetch.
     */
    where: TbCustPointGoldCurrent2017WhereUniqueInput
  }

  /**
   * TbCustPointGoldCurrent2017 findFirst
   */
  export type TbCustPointGoldCurrent2017FindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointGoldCurrent2017
     */
    select?: TbCustPointGoldCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointGoldCurrent2017
     */
    omit?: TbCustPointGoldCurrent2017Omit<ExtArgs> | null
    /**
     * Filter, which TbCustPointGoldCurrent2017 to fetch.
     */
    where?: TbCustPointGoldCurrent2017WhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointGoldCurrent2017s to fetch.
     */
    orderBy?: TbCustPointGoldCurrent2017OrderByWithRelationInput | TbCustPointGoldCurrent2017OrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TbCustPointGoldCurrent2017s.
     */
    cursor?: TbCustPointGoldCurrent2017WhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointGoldCurrent2017s from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointGoldCurrent2017s.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustPointGoldCurrent2017s.
     */
    distinct?: TbCustPointGoldCurrent2017ScalarFieldEnum | TbCustPointGoldCurrent2017ScalarFieldEnum[]
  }

  /**
   * TbCustPointGoldCurrent2017 findFirstOrThrow
   */
  export type TbCustPointGoldCurrent2017FindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointGoldCurrent2017
     */
    select?: TbCustPointGoldCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointGoldCurrent2017
     */
    omit?: TbCustPointGoldCurrent2017Omit<ExtArgs> | null
    /**
     * Filter, which TbCustPointGoldCurrent2017 to fetch.
     */
    where?: TbCustPointGoldCurrent2017WhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointGoldCurrent2017s to fetch.
     */
    orderBy?: TbCustPointGoldCurrent2017OrderByWithRelationInput | TbCustPointGoldCurrent2017OrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TbCustPointGoldCurrent2017s.
     */
    cursor?: TbCustPointGoldCurrent2017WhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointGoldCurrent2017s from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointGoldCurrent2017s.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustPointGoldCurrent2017s.
     */
    distinct?: TbCustPointGoldCurrent2017ScalarFieldEnum | TbCustPointGoldCurrent2017ScalarFieldEnum[]
  }

  /**
   * TbCustPointGoldCurrent2017 findMany
   */
  export type TbCustPointGoldCurrent2017FindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointGoldCurrent2017
     */
    select?: TbCustPointGoldCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointGoldCurrent2017
     */
    omit?: TbCustPointGoldCurrent2017Omit<ExtArgs> | null
    /**
     * Filter, which TbCustPointGoldCurrent2017s to fetch.
     */
    where?: TbCustPointGoldCurrent2017WhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointGoldCurrent2017s to fetch.
     */
    orderBy?: TbCustPointGoldCurrent2017OrderByWithRelationInput | TbCustPointGoldCurrent2017OrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TbCustPointGoldCurrent2017s.
     */
    cursor?: TbCustPointGoldCurrent2017WhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointGoldCurrent2017s from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointGoldCurrent2017s.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustPointGoldCurrent2017s.
     */
    distinct?: TbCustPointGoldCurrent2017ScalarFieldEnum | TbCustPointGoldCurrent2017ScalarFieldEnum[]
  }

  /**
   * TbCustPointGoldCurrent2017 create
   */
  export type TbCustPointGoldCurrent2017CreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointGoldCurrent2017
     */
    select?: TbCustPointGoldCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointGoldCurrent2017
     */
    omit?: TbCustPointGoldCurrent2017Omit<ExtArgs> | null
    /**
     * The data needed to create a TbCustPointGoldCurrent2017.
     */
    data?: XOR<TbCustPointGoldCurrent2017CreateInput, TbCustPointGoldCurrent2017UncheckedCreateInput>
  }

  /**
   * TbCustPointGoldCurrent2017 createMany
   */
  export type TbCustPointGoldCurrent2017CreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TbCustPointGoldCurrent2017s.
     */
    data: TbCustPointGoldCurrent2017CreateManyInput | TbCustPointGoldCurrent2017CreateManyInput[]
  }

  /**
   * TbCustPointGoldCurrent2017 update
   */
  export type TbCustPointGoldCurrent2017UpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointGoldCurrent2017
     */
    select?: TbCustPointGoldCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointGoldCurrent2017
     */
    omit?: TbCustPointGoldCurrent2017Omit<ExtArgs> | null
    /**
     * The data needed to update a TbCustPointGoldCurrent2017.
     */
    data: XOR<TbCustPointGoldCurrent2017UpdateInput, TbCustPointGoldCurrent2017UncheckedUpdateInput>
    /**
     * Choose, which TbCustPointGoldCurrent2017 to update.
     */
    where: TbCustPointGoldCurrent2017WhereUniqueInput
  }

  /**
   * TbCustPointGoldCurrent2017 updateMany
   */
  export type TbCustPointGoldCurrent2017UpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TbCustPointGoldCurrent2017s.
     */
    data: XOR<TbCustPointGoldCurrent2017UpdateManyMutationInput, TbCustPointGoldCurrent2017UncheckedUpdateManyInput>
    /**
     * Filter which TbCustPointGoldCurrent2017s to update
     */
    where?: TbCustPointGoldCurrent2017WhereInput
    /**
     * Limit how many TbCustPointGoldCurrent2017s to update.
     */
    limit?: number
  }

  /**
   * TbCustPointGoldCurrent2017 upsert
   */
  export type TbCustPointGoldCurrent2017UpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointGoldCurrent2017
     */
    select?: TbCustPointGoldCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointGoldCurrent2017
     */
    omit?: TbCustPointGoldCurrent2017Omit<ExtArgs> | null
    /**
     * The filter to search for the TbCustPointGoldCurrent2017 to update in case it exists.
     */
    where: TbCustPointGoldCurrent2017WhereUniqueInput
    /**
     * In case the TbCustPointGoldCurrent2017 found by the `where` argument doesn't exist, create a new TbCustPointGoldCurrent2017 with this data.
     */
    create: XOR<TbCustPointGoldCurrent2017CreateInput, TbCustPointGoldCurrent2017UncheckedCreateInput>
    /**
     * In case the TbCustPointGoldCurrent2017 was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TbCustPointGoldCurrent2017UpdateInput, TbCustPointGoldCurrent2017UncheckedUpdateInput>
  }

  /**
   * TbCustPointGoldCurrent2017 delete
   */
  export type TbCustPointGoldCurrent2017DeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointGoldCurrent2017
     */
    select?: TbCustPointGoldCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointGoldCurrent2017
     */
    omit?: TbCustPointGoldCurrent2017Omit<ExtArgs> | null
    /**
     * Filter which TbCustPointGoldCurrent2017 to delete.
     */
    where: TbCustPointGoldCurrent2017WhereUniqueInput
  }

  /**
   * TbCustPointGoldCurrent2017 deleteMany
   */
  export type TbCustPointGoldCurrent2017DeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TbCustPointGoldCurrent2017s to delete
     */
    where?: TbCustPointGoldCurrent2017WhereInput
    /**
     * Limit how many TbCustPointGoldCurrent2017s to delete.
     */
    limit?: number
  }

  /**
   * TbCustPointGoldCurrent2017 without action
   */
  export type TbCustPointGoldCurrent2017DefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointGoldCurrent2017
     */
    select?: TbCustPointGoldCurrent2017Select<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointGoldCurrent2017
     */
    omit?: TbCustPointGoldCurrent2017Omit<ExtArgs> | null
  }


  /**
   * Model TbCustPointSilverCashCurrent
   */

  export type AggregateTbCustPointSilverCashCurrent = {
    _count: TbCustPointSilverCashCurrentCountAggregateOutputType | null
    _avg: TbCustPointSilverCashCurrentAvgAggregateOutputType | null
    _sum: TbCustPointSilverCashCurrentSumAggregateOutputType | null
    _min: TbCustPointSilverCashCurrentMinAggregateOutputType | null
    _max: TbCustPointSilverCashCurrentMaxAggregateOutputType | null
  }

  export type TbCustPointSilverCashCurrentAvgAggregateOutputType = {
    itemId: number | null
    currentCashPoint: number | null
    status2017: number | null
  }

  export type TbCustPointSilverCashCurrentSumAggregateOutputType = {
    itemId: number | null
    currentCashPoint: number | null
    status2017: number | null
  }

  export type TbCustPointSilverCashCurrentMinAggregateOutputType = {
    itemId: number | null
    custId: string | null
    currentCashPoint: number | null
    pointDate: Date | null
    note: string | null
    pointType: string | null
    createDate: Date | null
    status2017: number | null
    expireDate: Date | null
  }

  export type TbCustPointSilverCashCurrentMaxAggregateOutputType = {
    itemId: number | null
    custId: string | null
    currentCashPoint: number | null
    pointDate: Date | null
    note: string | null
    pointType: string | null
    createDate: Date | null
    status2017: number | null
    expireDate: Date | null
  }

  export type TbCustPointSilverCashCurrentCountAggregateOutputType = {
    itemId: number
    custId: number
    currentCashPoint: number
    pointDate: number
    note: number
    pointType: number
    createDate: number
    status2017: number
    expireDate: number
    _all: number
  }


  export type TbCustPointSilverCashCurrentAvgAggregateInputType = {
    itemId?: true
    currentCashPoint?: true
    status2017?: true
  }

  export type TbCustPointSilverCashCurrentSumAggregateInputType = {
    itemId?: true
    currentCashPoint?: true
    status2017?: true
  }

  export type TbCustPointSilverCashCurrentMinAggregateInputType = {
    itemId?: true
    custId?: true
    currentCashPoint?: true
    pointDate?: true
    note?: true
    pointType?: true
    createDate?: true
    status2017?: true
    expireDate?: true
  }

  export type TbCustPointSilverCashCurrentMaxAggregateInputType = {
    itemId?: true
    custId?: true
    currentCashPoint?: true
    pointDate?: true
    note?: true
    pointType?: true
    createDate?: true
    status2017?: true
    expireDate?: true
  }

  export type TbCustPointSilverCashCurrentCountAggregateInputType = {
    itemId?: true
    custId?: true
    currentCashPoint?: true
    pointDate?: true
    note?: true
    pointType?: true
    createDate?: true
    status2017?: true
    expireDate?: true
    _all?: true
  }

  export type TbCustPointSilverCashCurrentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TbCustPointSilverCashCurrent to aggregate.
     */
    where?: TbCustPointSilverCashCurrentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointSilverCashCurrents to fetch.
     */
    orderBy?: TbCustPointSilverCashCurrentOrderByWithRelationInput | TbCustPointSilverCashCurrentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TbCustPointSilverCashCurrentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointSilverCashCurrents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointSilverCashCurrents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TbCustPointSilverCashCurrents
    **/
    _count?: true | TbCustPointSilverCashCurrentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TbCustPointSilverCashCurrentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TbCustPointSilverCashCurrentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbCustPointSilverCashCurrentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbCustPointSilverCashCurrentMaxAggregateInputType
  }

  export type GetTbCustPointSilverCashCurrentAggregateType<T extends TbCustPointSilverCashCurrentAggregateArgs> = {
        [P in keyof T & keyof AggregateTbCustPointSilverCashCurrent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbCustPointSilverCashCurrent[P]>
      : GetScalarType<T[P], AggregateTbCustPointSilverCashCurrent[P]>
  }




  export type TbCustPointSilverCashCurrentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TbCustPointSilverCashCurrentWhereInput
    orderBy?: TbCustPointSilverCashCurrentOrderByWithAggregationInput | TbCustPointSilverCashCurrentOrderByWithAggregationInput[]
    by: TbCustPointSilverCashCurrentScalarFieldEnum[] | TbCustPointSilverCashCurrentScalarFieldEnum
    having?: TbCustPointSilverCashCurrentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbCustPointSilverCashCurrentCountAggregateInputType | true
    _avg?: TbCustPointSilverCashCurrentAvgAggregateInputType
    _sum?: TbCustPointSilverCashCurrentSumAggregateInputType
    _min?: TbCustPointSilverCashCurrentMinAggregateInputType
    _max?: TbCustPointSilverCashCurrentMaxAggregateInputType
  }

  export type TbCustPointSilverCashCurrentGroupByOutputType = {
    itemId: number
    custId: string | null
    currentCashPoint: number | null
    pointDate: Date | null
    note: string | null
    pointType: string | null
    createDate: Date | null
    status2017: number | null
    expireDate: Date | null
    _count: TbCustPointSilverCashCurrentCountAggregateOutputType | null
    _avg: TbCustPointSilverCashCurrentAvgAggregateOutputType | null
    _sum: TbCustPointSilverCashCurrentSumAggregateOutputType | null
    _min: TbCustPointSilverCashCurrentMinAggregateOutputType | null
    _max: TbCustPointSilverCashCurrentMaxAggregateOutputType | null
  }

  type GetTbCustPointSilverCashCurrentGroupByPayload<T extends TbCustPointSilverCashCurrentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbCustPointSilverCashCurrentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbCustPointSilverCashCurrentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbCustPointSilverCashCurrentGroupByOutputType[P]>
            : GetScalarType<T[P], TbCustPointSilverCashCurrentGroupByOutputType[P]>
        }
      >
    >


  export type TbCustPointSilverCashCurrentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    itemId?: boolean
    custId?: boolean
    currentCashPoint?: boolean
    pointDate?: boolean
    note?: boolean
    pointType?: boolean
    createDate?: boolean
    status2017?: boolean
    expireDate?: boolean
  }, ExtArgs["result"]["tbCustPointSilverCashCurrent"]>



  export type TbCustPointSilverCashCurrentSelectScalar = {
    itemId?: boolean
    custId?: boolean
    currentCashPoint?: boolean
    pointDate?: boolean
    note?: boolean
    pointType?: boolean
    createDate?: boolean
    status2017?: boolean
    expireDate?: boolean
  }

  export type TbCustPointSilverCashCurrentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"itemId" | "custId" | "currentCashPoint" | "pointDate" | "note" | "pointType" | "createDate" | "status2017" | "expireDate", ExtArgs["result"]["tbCustPointSilverCashCurrent"]>

  export type $TbCustPointSilverCashCurrentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TbCustPointSilverCashCurrent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      itemId: number
      custId: string | null
      currentCashPoint: number | null
      pointDate: Date | null
      note: string | null
      pointType: string | null
      createDate: Date | null
      status2017: number | null
      expireDate: Date | null
    }, ExtArgs["result"]["tbCustPointSilverCashCurrent"]>
    composites: {}
  }

  type TbCustPointSilverCashCurrentGetPayload<S extends boolean | null | undefined | TbCustPointSilverCashCurrentDefaultArgs> = $Result.GetResult<Prisma.$TbCustPointSilverCashCurrentPayload, S>

  type TbCustPointSilverCashCurrentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TbCustPointSilverCashCurrentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbCustPointSilverCashCurrentCountAggregateInputType | true
    }

  export interface TbCustPointSilverCashCurrentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TbCustPointSilverCashCurrent'], meta: { name: 'TbCustPointSilverCashCurrent' } }
    /**
     * Find zero or one TbCustPointSilverCashCurrent that matches the filter.
     * @param {TbCustPointSilverCashCurrentFindUniqueArgs} args - Arguments to find a TbCustPointSilverCashCurrent
     * @example
     * // Get one TbCustPointSilverCashCurrent
     * const tbCustPointSilverCashCurrent = await prisma.tbCustPointSilverCashCurrent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TbCustPointSilverCashCurrentFindUniqueArgs>(args: SelectSubset<T, TbCustPointSilverCashCurrentFindUniqueArgs<ExtArgs>>): Prisma__TbCustPointSilverCashCurrentClient<$Result.GetResult<Prisma.$TbCustPointSilverCashCurrentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbCustPointSilverCashCurrent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TbCustPointSilverCashCurrentFindUniqueOrThrowArgs} args - Arguments to find a TbCustPointSilverCashCurrent
     * @example
     * // Get one TbCustPointSilverCashCurrent
     * const tbCustPointSilverCashCurrent = await prisma.tbCustPointSilverCashCurrent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TbCustPointSilverCashCurrentFindUniqueOrThrowArgs>(args: SelectSubset<T, TbCustPointSilverCashCurrentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TbCustPointSilverCashCurrentClient<$Result.GetResult<Prisma.$TbCustPointSilverCashCurrentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCustPointSilverCashCurrent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCashCurrentFindFirstArgs} args - Arguments to find a TbCustPointSilverCashCurrent
     * @example
     * // Get one TbCustPointSilverCashCurrent
     * const tbCustPointSilverCashCurrent = await prisma.tbCustPointSilverCashCurrent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TbCustPointSilverCashCurrentFindFirstArgs>(args?: SelectSubset<T, TbCustPointSilverCashCurrentFindFirstArgs<ExtArgs>>): Prisma__TbCustPointSilverCashCurrentClient<$Result.GetResult<Prisma.$TbCustPointSilverCashCurrentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCustPointSilverCashCurrent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCashCurrentFindFirstOrThrowArgs} args - Arguments to find a TbCustPointSilverCashCurrent
     * @example
     * // Get one TbCustPointSilverCashCurrent
     * const tbCustPointSilverCashCurrent = await prisma.tbCustPointSilverCashCurrent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TbCustPointSilverCashCurrentFindFirstOrThrowArgs>(args?: SelectSubset<T, TbCustPointSilverCashCurrentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TbCustPointSilverCashCurrentClient<$Result.GetResult<Prisma.$TbCustPointSilverCashCurrentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbCustPointSilverCashCurrents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCashCurrentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbCustPointSilverCashCurrents
     * const tbCustPointSilverCashCurrents = await prisma.tbCustPointSilverCashCurrent.findMany()
     * 
     * // Get first 10 TbCustPointSilverCashCurrents
     * const tbCustPointSilverCashCurrents = await prisma.tbCustPointSilverCashCurrent.findMany({ take: 10 })
     * 
     * // Only select the `itemId`
     * const tbCustPointSilverCashCurrentWithItemIdOnly = await prisma.tbCustPointSilverCashCurrent.findMany({ select: { itemId: true } })
     * 
     */
    findMany<T extends TbCustPointSilverCashCurrentFindManyArgs>(args?: SelectSubset<T, TbCustPointSilverCashCurrentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TbCustPointSilverCashCurrentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbCustPointSilverCashCurrent.
     * @param {TbCustPointSilverCashCurrentCreateArgs} args - Arguments to create a TbCustPointSilverCashCurrent.
     * @example
     * // Create one TbCustPointSilverCashCurrent
     * const TbCustPointSilverCashCurrent = await prisma.tbCustPointSilverCashCurrent.create({
     *   data: {
     *     // ... data to create a TbCustPointSilverCashCurrent
     *   }
     * })
     * 
     */
    create<T extends TbCustPointSilverCashCurrentCreateArgs>(args: SelectSubset<T, TbCustPointSilverCashCurrentCreateArgs<ExtArgs>>): Prisma__TbCustPointSilverCashCurrentClient<$Result.GetResult<Prisma.$TbCustPointSilverCashCurrentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbCustPointSilverCashCurrents.
     * @param {TbCustPointSilverCashCurrentCreateManyArgs} args - Arguments to create many TbCustPointSilverCashCurrents.
     * @example
     * // Create many TbCustPointSilverCashCurrents
     * const tbCustPointSilverCashCurrent = await prisma.tbCustPointSilverCashCurrent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TbCustPointSilverCashCurrentCreateManyArgs>(args?: SelectSubset<T, TbCustPointSilverCashCurrentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TbCustPointSilverCashCurrent.
     * @param {TbCustPointSilverCashCurrentDeleteArgs} args - Arguments to delete one TbCustPointSilverCashCurrent.
     * @example
     * // Delete one TbCustPointSilverCashCurrent
     * const TbCustPointSilverCashCurrent = await prisma.tbCustPointSilverCashCurrent.delete({
     *   where: {
     *     // ... filter to delete one TbCustPointSilverCashCurrent
     *   }
     * })
     * 
     */
    delete<T extends TbCustPointSilverCashCurrentDeleteArgs>(args: SelectSubset<T, TbCustPointSilverCashCurrentDeleteArgs<ExtArgs>>): Prisma__TbCustPointSilverCashCurrentClient<$Result.GetResult<Prisma.$TbCustPointSilverCashCurrentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbCustPointSilverCashCurrent.
     * @param {TbCustPointSilverCashCurrentUpdateArgs} args - Arguments to update one TbCustPointSilverCashCurrent.
     * @example
     * // Update one TbCustPointSilverCashCurrent
     * const tbCustPointSilverCashCurrent = await prisma.tbCustPointSilverCashCurrent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TbCustPointSilverCashCurrentUpdateArgs>(args: SelectSubset<T, TbCustPointSilverCashCurrentUpdateArgs<ExtArgs>>): Prisma__TbCustPointSilverCashCurrentClient<$Result.GetResult<Prisma.$TbCustPointSilverCashCurrentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbCustPointSilverCashCurrents.
     * @param {TbCustPointSilverCashCurrentDeleteManyArgs} args - Arguments to filter TbCustPointSilverCashCurrents to delete.
     * @example
     * // Delete a few TbCustPointSilverCashCurrents
     * const { count } = await prisma.tbCustPointSilverCashCurrent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TbCustPointSilverCashCurrentDeleteManyArgs>(args?: SelectSubset<T, TbCustPointSilverCashCurrentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbCustPointSilverCashCurrents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCashCurrentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbCustPointSilverCashCurrents
     * const tbCustPointSilverCashCurrent = await prisma.tbCustPointSilverCashCurrent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TbCustPointSilverCashCurrentUpdateManyArgs>(args: SelectSubset<T, TbCustPointSilverCashCurrentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TbCustPointSilverCashCurrent.
     * @param {TbCustPointSilverCashCurrentUpsertArgs} args - Arguments to update or create a TbCustPointSilverCashCurrent.
     * @example
     * // Update or create a TbCustPointSilverCashCurrent
     * const tbCustPointSilverCashCurrent = await prisma.tbCustPointSilverCashCurrent.upsert({
     *   create: {
     *     // ... data to create a TbCustPointSilverCashCurrent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbCustPointSilverCashCurrent we want to update
     *   }
     * })
     */
    upsert<T extends TbCustPointSilverCashCurrentUpsertArgs>(args: SelectSubset<T, TbCustPointSilverCashCurrentUpsertArgs<ExtArgs>>): Prisma__TbCustPointSilverCashCurrentClient<$Result.GetResult<Prisma.$TbCustPointSilverCashCurrentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbCustPointSilverCashCurrents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCashCurrentCountArgs} args - Arguments to filter TbCustPointSilverCashCurrents to count.
     * @example
     * // Count the number of TbCustPointSilverCashCurrents
     * const count = await prisma.tbCustPointSilverCashCurrent.count({
     *   where: {
     *     // ... the filter for the TbCustPointSilverCashCurrents we want to count
     *   }
     * })
    **/
    count<T extends TbCustPointSilverCashCurrentCountArgs>(
      args?: Subset<T, TbCustPointSilverCashCurrentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbCustPointSilverCashCurrentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbCustPointSilverCashCurrent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCashCurrentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbCustPointSilverCashCurrentAggregateArgs>(args: Subset<T, TbCustPointSilverCashCurrentAggregateArgs>): Prisma.PrismaPromise<GetTbCustPointSilverCashCurrentAggregateType<T>>

    /**
     * Group by TbCustPointSilverCashCurrent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustPointSilverCashCurrentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TbCustPointSilverCashCurrentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TbCustPointSilverCashCurrentGroupByArgs['orderBy'] }
        : { orderBy?: TbCustPointSilverCashCurrentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TbCustPointSilverCashCurrentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbCustPointSilverCashCurrentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TbCustPointSilverCashCurrent model
   */
  readonly fields: TbCustPointSilverCashCurrentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TbCustPointSilverCashCurrent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TbCustPointSilverCashCurrentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TbCustPointSilverCashCurrent model
   */
  interface TbCustPointSilverCashCurrentFieldRefs {
    readonly itemId: FieldRef<"TbCustPointSilverCashCurrent", 'Int'>
    readonly custId: FieldRef<"TbCustPointSilverCashCurrent", 'String'>
    readonly currentCashPoint: FieldRef<"TbCustPointSilverCashCurrent", 'Float'>
    readonly pointDate: FieldRef<"TbCustPointSilverCashCurrent", 'DateTime'>
    readonly note: FieldRef<"TbCustPointSilverCashCurrent", 'String'>
    readonly pointType: FieldRef<"TbCustPointSilverCashCurrent", 'String'>
    readonly createDate: FieldRef<"TbCustPointSilverCashCurrent", 'DateTime'>
    readonly status2017: FieldRef<"TbCustPointSilverCashCurrent", 'Int'>
    readonly expireDate: FieldRef<"TbCustPointSilverCashCurrent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TbCustPointSilverCashCurrent findUnique
   */
  export type TbCustPointSilverCashCurrentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCashCurrent
     */
    select?: TbCustPointSilverCashCurrentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCashCurrent
     */
    omit?: TbCustPointSilverCashCurrentOmit<ExtArgs> | null
    /**
     * Filter, which TbCustPointSilverCashCurrent to fetch.
     */
    where: TbCustPointSilverCashCurrentWhereUniqueInput
  }

  /**
   * TbCustPointSilverCashCurrent findUniqueOrThrow
   */
  export type TbCustPointSilverCashCurrentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCashCurrent
     */
    select?: TbCustPointSilverCashCurrentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCashCurrent
     */
    omit?: TbCustPointSilverCashCurrentOmit<ExtArgs> | null
    /**
     * Filter, which TbCustPointSilverCashCurrent to fetch.
     */
    where: TbCustPointSilverCashCurrentWhereUniqueInput
  }

  /**
   * TbCustPointSilverCashCurrent findFirst
   */
  export type TbCustPointSilverCashCurrentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCashCurrent
     */
    select?: TbCustPointSilverCashCurrentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCashCurrent
     */
    omit?: TbCustPointSilverCashCurrentOmit<ExtArgs> | null
    /**
     * Filter, which TbCustPointSilverCashCurrent to fetch.
     */
    where?: TbCustPointSilverCashCurrentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointSilverCashCurrents to fetch.
     */
    orderBy?: TbCustPointSilverCashCurrentOrderByWithRelationInput | TbCustPointSilverCashCurrentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TbCustPointSilverCashCurrents.
     */
    cursor?: TbCustPointSilverCashCurrentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointSilverCashCurrents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointSilverCashCurrents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustPointSilverCashCurrents.
     */
    distinct?: TbCustPointSilverCashCurrentScalarFieldEnum | TbCustPointSilverCashCurrentScalarFieldEnum[]
  }

  /**
   * TbCustPointSilverCashCurrent findFirstOrThrow
   */
  export type TbCustPointSilverCashCurrentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCashCurrent
     */
    select?: TbCustPointSilverCashCurrentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCashCurrent
     */
    omit?: TbCustPointSilverCashCurrentOmit<ExtArgs> | null
    /**
     * Filter, which TbCustPointSilverCashCurrent to fetch.
     */
    where?: TbCustPointSilverCashCurrentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointSilverCashCurrents to fetch.
     */
    orderBy?: TbCustPointSilverCashCurrentOrderByWithRelationInput | TbCustPointSilverCashCurrentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TbCustPointSilverCashCurrents.
     */
    cursor?: TbCustPointSilverCashCurrentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointSilverCashCurrents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointSilverCashCurrents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustPointSilverCashCurrents.
     */
    distinct?: TbCustPointSilverCashCurrentScalarFieldEnum | TbCustPointSilverCashCurrentScalarFieldEnum[]
  }

  /**
   * TbCustPointSilverCashCurrent findMany
   */
  export type TbCustPointSilverCashCurrentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCashCurrent
     */
    select?: TbCustPointSilverCashCurrentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCashCurrent
     */
    omit?: TbCustPointSilverCashCurrentOmit<ExtArgs> | null
    /**
     * Filter, which TbCustPointSilverCashCurrents to fetch.
     */
    where?: TbCustPointSilverCashCurrentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustPointSilverCashCurrents to fetch.
     */
    orderBy?: TbCustPointSilverCashCurrentOrderByWithRelationInput | TbCustPointSilverCashCurrentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TbCustPointSilverCashCurrents.
     */
    cursor?: TbCustPointSilverCashCurrentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustPointSilverCashCurrents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustPointSilverCashCurrents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustPointSilverCashCurrents.
     */
    distinct?: TbCustPointSilverCashCurrentScalarFieldEnum | TbCustPointSilverCashCurrentScalarFieldEnum[]
  }

  /**
   * TbCustPointSilverCashCurrent create
   */
  export type TbCustPointSilverCashCurrentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCashCurrent
     */
    select?: TbCustPointSilverCashCurrentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCashCurrent
     */
    omit?: TbCustPointSilverCashCurrentOmit<ExtArgs> | null
    /**
     * The data needed to create a TbCustPointSilverCashCurrent.
     */
    data?: XOR<TbCustPointSilverCashCurrentCreateInput, TbCustPointSilverCashCurrentUncheckedCreateInput>
  }

  /**
   * TbCustPointSilverCashCurrent createMany
   */
  export type TbCustPointSilverCashCurrentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TbCustPointSilverCashCurrents.
     */
    data: TbCustPointSilverCashCurrentCreateManyInput | TbCustPointSilverCashCurrentCreateManyInput[]
  }

  /**
   * TbCustPointSilverCashCurrent update
   */
  export type TbCustPointSilverCashCurrentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCashCurrent
     */
    select?: TbCustPointSilverCashCurrentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCashCurrent
     */
    omit?: TbCustPointSilverCashCurrentOmit<ExtArgs> | null
    /**
     * The data needed to update a TbCustPointSilverCashCurrent.
     */
    data: XOR<TbCustPointSilverCashCurrentUpdateInput, TbCustPointSilverCashCurrentUncheckedUpdateInput>
    /**
     * Choose, which TbCustPointSilverCashCurrent to update.
     */
    where: TbCustPointSilverCashCurrentWhereUniqueInput
  }

  /**
   * TbCustPointSilverCashCurrent updateMany
   */
  export type TbCustPointSilverCashCurrentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TbCustPointSilverCashCurrents.
     */
    data: XOR<TbCustPointSilverCashCurrentUpdateManyMutationInput, TbCustPointSilverCashCurrentUncheckedUpdateManyInput>
    /**
     * Filter which TbCustPointSilverCashCurrents to update
     */
    where?: TbCustPointSilverCashCurrentWhereInput
    /**
     * Limit how many TbCustPointSilverCashCurrents to update.
     */
    limit?: number
  }

  /**
   * TbCustPointSilverCashCurrent upsert
   */
  export type TbCustPointSilverCashCurrentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCashCurrent
     */
    select?: TbCustPointSilverCashCurrentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCashCurrent
     */
    omit?: TbCustPointSilverCashCurrentOmit<ExtArgs> | null
    /**
     * The filter to search for the TbCustPointSilverCashCurrent to update in case it exists.
     */
    where: TbCustPointSilverCashCurrentWhereUniqueInput
    /**
     * In case the TbCustPointSilverCashCurrent found by the `where` argument doesn't exist, create a new TbCustPointSilverCashCurrent with this data.
     */
    create: XOR<TbCustPointSilverCashCurrentCreateInput, TbCustPointSilverCashCurrentUncheckedCreateInput>
    /**
     * In case the TbCustPointSilverCashCurrent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TbCustPointSilverCashCurrentUpdateInput, TbCustPointSilverCashCurrentUncheckedUpdateInput>
  }

  /**
   * TbCustPointSilverCashCurrent delete
   */
  export type TbCustPointSilverCashCurrentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCashCurrent
     */
    select?: TbCustPointSilverCashCurrentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCashCurrent
     */
    omit?: TbCustPointSilverCashCurrentOmit<ExtArgs> | null
    /**
     * Filter which TbCustPointSilverCashCurrent to delete.
     */
    where: TbCustPointSilverCashCurrentWhereUniqueInput
  }

  /**
   * TbCustPointSilverCashCurrent deleteMany
   */
  export type TbCustPointSilverCashCurrentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TbCustPointSilverCashCurrents to delete
     */
    where?: TbCustPointSilverCashCurrentWhereInput
    /**
     * Limit how many TbCustPointSilverCashCurrents to delete.
     */
    limit?: number
  }

  /**
   * TbCustPointSilverCashCurrent without action
   */
  export type TbCustPointSilverCashCurrentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustPointSilverCashCurrent
     */
    select?: TbCustPointSilverCashCurrentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustPointSilverCashCurrent
     */
    omit?: TbCustPointSilverCashCurrentOmit<ExtArgs> | null
  }


  /**
   * Model TbCustGoldToAdjust
   */

  export type AggregateTbCustGoldToAdjust = {
    _count: TbCustGoldToAdjustCountAggregateOutputType | null
    _avg: TbCustGoldToAdjustAvgAggregateOutputType | null
    _sum: TbCustGoldToAdjustSumAggregateOutputType | null
    _min: TbCustGoldToAdjustMinAggregateOutputType | null
    _max: TbCustGoldToAdjustMaxAggregateOutputType | null
  }

  export type TbCustGoldToAdjustAvgAggregateOutputType = {
    itemId: number | null
    goldYear: number | null
    currentGold: number | null
    status2017: number | null
  }

  export type TbCustGoldToAdjustSumAggregateOutputType = {
    itemId: number | null
    goldYear: number | null
    currentGold: number | null
    status2017: number | null
  }

  export type TbCustGoldToAdjustMinAggregateOutputType = {
    itemId: number | null
    goldYear: number | null
    custId: string | null
    currentGold: number | null
    pointDate: Date | null
    note: string | null
    pointType: string | null
    createDate: Date | null
    status2017: number | null
    expireDate: Date | null
    remarck: string | null
  }

  export type TbCustGoldToAdjustMaxAggregateOutputType = {
    itemId: number | null
    goldYear: number | null
    custId: string | null
    currentGold: number | null
    pointDate: Date | null
    note: string | null
    pointType: string | null
    createDate: Date | null
    status2017: number | null
    expireDate: Date | null
    remarck: string | null
  }

  export type TbCustGoldToAdjustCountAggregateOutputType = {
    itemId: number
    goldYear: number
    custId: number
    currentGold: number
    pointDate: number
    note: number
    pointType: number
    createDate: number
    status2017: number
    expireDate: number
    remarck: number
    _all: number
  }


  export type TbCustGoldToAdjustAvgAggregateInputType = {
    itemId?: true
    goldYear?: true
    currentGold?: true
    status2017?: true
  }

  export type TbCustGoldToAdjustSumAggregateInputType = {
    itemId?: true
    goldYear?: true
    currentGold?: true
    status2017?: true
  }

  export type TbCustGoldToAdjustMinAggregateInputType = {
    itemId?: true
    goldYear?: true
    custId?: true
    currentGold?: true
    pointDate?: true
    note?: true
    pointType?: true
    createDate?: true
    status2017?: true
    expireDate?: true
    remarck?: true
  }

  export type TbCustGoldToAdjustMaxAggregateInputType = {
    itemId?: true
    goldYear?: true
    custId?: true
    currentGold?: true
    pointDate?: true
    note?: true
    pointType?: true
    createDate?: true
    status2017?: true
    expireDate?: true
    remarck?: true
  }

  export type TbCustGoldToAdjustCountAggregateInputType = {
    itemId?: true
    goldYear?: true
    custId?: true
    currentGold?: true
    pointDate?: true
    note?: true
    pointType?: true
    createDate?: true
    status2017?: true
    expireDate?: true
    remarck?: true
    _all?: true
  }

  export type TbCustGoldToAdjustAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TbCustGoldToAdjust to aggregate.
     */
    where?: TbCustGoldToAdjustWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustGoldToAdjusts to fetch.
     */
    orderBy?: TbCustGoldToAdjustOrderByWithRelationInput | TbCustGoldToAdjustOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TbCustGoldToAdjustWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustGoldToAdjusts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustGoldToAdjusts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TbCustGoldToAdjusts
    **/
    _count?: true | TbCustGoldToAdjustCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TbCustGoldToAdjustAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TbCustGoldToAdjustSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TbCustGoldToAdjustMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TbCustGoldToAdjustMaxAggregateInputType
  }

  export type GetTbCustGoldToAdjustAggregateType<T extends TbCustGoldToAdjustAggregateArgs> = {
        [P in keyof T & keyof AggregateTbCustGoldToAdjust]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTbCustGoldToAdjust[P]>
      : GetScalarType<T[P], AggregateTbCustGoldToAdjust[P]>
  }




  export type TbCustGoldToAdjustGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TbCustGoldToAdjustWhereInput
    orderBy?: TbCustGoldToAdjustOrderByWithAggregationInput | TbCustGoldToAdjustOrderByWithAggregationInput[]
    by: TbCustGoldToAdjustScalarFieldEnum[] | TbCustGoldToAdjustScalarFieldEnum
    having?: TbCustGoldToAdjustScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TbCustGoldToAdjustCountAggregateInputType | true
    _avg?: TbCustGoldToAdjustAvgAggregateInputType
    _sum?: TbCustGoldToAdjustSumAggregateInputType
    _min?: TbCustGoldToAdjustMinAggregateInputType
    _max?: TbCustGoldToAdjustMaxAggregateInputType
  }

  export type TbCustGoldToAdjustGroupByOutputType = {
    itemId: number
    goldYear: number | null
    custId: string | null
    currentGold: number | null
    pointDate: Date | null
    note: string | null
    pointType: string | null
    createDate: Date | null
    status2017: number | null
    expireDate: Date | null
    remarck: string | null
    _count: TbCustGoldToAdjustCountAggregateOutputType | null
    _avg: TbCustGoldToAdjustAvgAggregateOutputType | null
    _sum: TbCustGoldToAdjustSumAggregateOutputType | null
    _min: TbCustGoldToAdjustMinAggregateOutputType | null
    _max: TbCustGoldToAdjustMaxAggregateOutputType | null
  }

  type GetTbCustGoldToAdjustGroupByPayload<T extends TbCustGoldToAdjustGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TbCustGoldToAdjustGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TbCustGoldToAdjustGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TbCustGoldToAdjustGroupByOutputType[P]>
            : GetScalarType<T[P], TbCustGoldToAdjustGroupByOutputType[P]>
        }
      >
    >


  export type TbCustGoldToAdjustSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    itemId?: boolean
    goldYear?: boolean
    custId?: boolean
    currentGold?: boolean
    pointDate?: boolean
    note?: boolean
    pointType?: boolean
    createDate?: boolean
    status2017?: boolean
    expireDate?: boolean
    remarck?: boolean
  }, ExtArgs["result"]["tbCustGoldToAdjust"]>



  export type TbCustGoldToAdjustSelectScalar = {
    itemId?: boolean
    goldYear?: boolean
    custId?: boolean
    currentGold?: boolean
    pointDate?: boolean
    note?: boolean
    pointType?: boolean
    createDate?: boolean
    status2017?: boolean
    expireDate?: boolean
    remarck?: boolean
  }

  export type TbCustGoldToAdjustOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"itemId" | "goldYear" | "custId" | "currentGold" | "pointDate" | "note" | "pointType" | "createDate" | "status2017" | "expireDate" | "remarck", ExtArgs["result"]["tbCustGoldToAdjust"]>

  export type $TbCustGoldToAdjustPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TbCustGoldToAdjust"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      itemId: number
      goldYear: number | null
      custId: string | null
      currentGold: number | null
      pointDate: Date | null
      note: string | null
      pointType: string | null
      createDate: Date | null
      status2017: number | null
      expireDate: Date | null
      remarck: string | null
    }, ExtArgs["result"]["tbCustGoldToAdjust"]>
    composites: {}
  }

  type TbCustGoldToAdjustGetPayload<S extends boolean | null | undefined | TbCustGoldToAdjustDefaultArgs> = $Result.GetResult<Prisma.$TbCustGoldToAdjustPayload, S>

  type TbCustGoldToAdjustCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TbCustGoldToAdjustFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TbCustGoldToAdjustCountAggregateInputType | true
    }

  export interface TbCustGoldToAdjustDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TbCustGoldToAdjust'], meta: { name: 'TbCustGoldToAdjust' } }
    /**
     * Find zero or one TbCustGoldToAdjust that matches the filter.
     * @param {TbCustGoldToAdjustFindUniqueArgs} args - Arguments to find a TbCustGoldToAdjust
     * @example
     * // Get one TbCustGoldToAdjust
     * const tbCustGoldToAdjust = await prisma.tbCustGoldToAdjust.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TbCustGoldToAdjustFindUniqueArgs>(args: SelectSubset<T, TbCustGoldToAdjustFindUniqueArgs<ExtArgs>>): Prisma__TbCustGoldToAdjustClient<$Result.GetResult<Prisma.$TbCustGoldToAdjustPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TbCustGoldToAdjust that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TbCustGoldToAdjustFindUniqueOrThrowArgs} args - Arguments to find a TbCustGoldToAdjust
     * @example
     * // Get one TbCustGoldToAdjust
     * const tbCustGoldToAdjust = await prisma.tbCustGoldToAdjust.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TbCustGoldToAdjustFindUniqueOrThrowArgs>(args: SelectSubset<T, TbCustGoldToAdjustFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TbCustGoldToAdjustClient<$Result.GetResult<Prisma.$TbCustGoldToAdjustPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCustGoldToAdjust that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustGoldToAdjustFindFirstArgs} args - Arguments to find a TbCustGoldToAdjust
     * @example
     * // Get one TbCustGoldToAdjust
     * const tbCustGoldToAdjust = await prisma.tbCustGoldToAdjust.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TbCustGoldToAdjustFindFirstArgs>(args?: SelectSubset<T, TbCustGoldToAdjustFindFirstArgs<ExtArgs>>): Prisma__TbCustGoldToAdjustClient<$Result.GetResult<Prisma.$TbCustGoldToAdjustPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TbCustGoldToAdjust that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustGoldToAdjustFindFirstOrThrowArgs} args - Arguments to find a TbCustGoldToAdjust
     * @example
     * // Get one TbCustGoldToAdjust
     * const tbCustGoldToAdjust = await prisma.tbCustGoldToAdjust.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TbCustGoldToAdjustFindFirstOrThrowArgs>(args?: SelectSubset<T, TbCustGoldToAdjustFindFirstOrThrowArgs<ExtArgs>>): Prisma__TbCustGoldToAdjustClient<$Result.GetResult<Prisma.$TbCustGoldToAdjustPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TbCustGoldToAdjusts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustGoldToAdjustFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TbCustGoldToAdjusts
     * const tbCustGoldToAdjusts = await prisma.tbCustGoldToAdjust.findMany()
     * 
     * // Get first 10 TbCustGoldToAdjusts
     * const tbCustGoldToAdjusts = await prisma.tbCustGoldToAdjust.findMany({ take: 10 })
     * 
     * // Only select the `itemId`
     * const tbCustGoldToAdjustWithItemIdOnly = await prisma.tbCustGoldToAdjust.findMany({ select: { itemId: true } })
     * 
     */
    findMany<T extends TbCustGoldToAdjustFindManyArgs>(args?: SelectSubset<T, TbCustGoldToAdjustFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TbCustGoldToAdjustPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TbCustGoldToAdjust.
     * @param {TbCustGoldToAdjustCreateArgs} args - Arguments to create a TbCustGoldToAdjust.
     * @example
     * // Create one TbCustGoldToAdjust
     * const TbCustGoldToAdjust = await prisma.tbCustGoldToAdjust.create({
     *   data: {
     *     // ... data to create a TbCustGoldToAdjust
     *   }
     * })
     * 
     */
    create<T extends TbCustGoldToAdjustCreateArgs>(args: SelectSubset<T, TbCustGoldToAdjustCreateArgs<ExtArgs>>): Prisma__TbCustGoldToAdjustClient<$Result.GetResult<Prisma.$TbCustGoldToAdjustPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TbCustGoldToAdjusts.
     * @param {TbCustGoldToAdjustCreateManyArgs} args - Arguments to create many TbCustGoldToAdjusts.
     * @example
     * // Create many TbCustGoldToAdjusts
     * const tbCustGoldToAdjust = await prisma.tbCustGoldToAdjust.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TbCustGoldToAdjustCreateManyArgs>(args?: SelectSubset<T, TbCustGoldToAdjustCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TbCustGoldToAdjust.
     * @param {TbCustGoldToAdjustDeleteArgs} args - Arguments to delete one TbCustGoldToAdjust.
     * @example
     * // Delete one TbCustGoldToAdjust
     * const TbCustGoldToAdjust = await prisma.tbCustGoldToAdjust.delete({
     *   where: {
     *     // ... filter to delete one TbCustGoldToAdjust
     *   }
     * })
     * 
     */
    delete<T extends TbCustGoldToAdjustDeleteArgs>(args: SelectSubset<T, TbCustGoldToAdjustDeleteArgs<ExtArgs>>): Prisma__TbCustGoldToAdjustClient<$Result.GetResult<Prisma.$TbCustGoldToAdjustPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TbCustGoldToAdjust.
     * @param {TbCustGoldToAdjustUpdateArgs} args - Arguments to update one TbCustGoldToAdjust.
     * @example
     * // Update one TbCustGoldToAdjust
     * const tbCustGoldToAdjust = await prisma.tbCustGoldToAdjust.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TbCustGoldToAdjustUpdateArgs>(args: SelectSubset<T, TbCustGoldToAdjustUpdateArgs<ExtArgs>>): Prisma__TbCustGoldToAdjustClient<$Result.GetResult<Prisma.$TbCustGoldToAdjustPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TbCustGoldToAdjusts.
     * @param {TbCustGoldToAdjustDeleteManyArgs} args - Arguments to filter TbCustGoldToAdjusts to delete.
     * @example
     * // Delete a few TbCustGoldToAdjusts
     * const { count } = await prisma.tbCustGoldToAdjust.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TbCustGoldToAdjustDeleteManyArgs>(args?: SelectSubset<T, TbCustGoldToAdjustDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TbCustGoldToAdjusts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustGoldToAdjustUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TbCustGoldToAdjusts
     * const tbCustGoldToAdjust = await prisma.tbCustGoldToAdjust.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TbCustGoldToAdjustUpdateManyArgs>(args: SelectSubset<T, TbCustGoldToAdjustUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TbCustGoldToAdjust.
     * @param {TbCustGoldToAdjustUpsertArgs} args - Arguments to update or create a TbCustGoldToAdjust.
     * @example
     * // Update or create a TbCustGoldToAdjust
     * const tbCustGoldToAdjust = await prisma.tbCustGoldToAdjust.upsert({
     *   create: {
     *     // ... data to create a TbCustGoldToAdjust
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TbCustGoldToAdjust we want to update
     *   }
     * })
     */
    upsert<T extends TbCustGoldToAdjustUpsertArgs>(args: SelectSubset<T, TbCustGoldToAdjustUpsertArgs<ExtArgs>>): Prisma__TbCustGoldToAdjustClient<$Result.GetResult<Prisma.$TbCustGoldToAdjustPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TbCustGoldToAdjusts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustGoldToAdjustCountArgs} args - Arguments to filter TbCustGoldToAdjusts to count.
     * @example
     * // Count the number of TbCustGoldToAdjusts
     * const count = await prisma.tbCustGoldToAdjust.count({
     *   where: {
     *     // ... the filter for the TbCustGoldToAdjusts we want to count
     *   }
     * })
    **/
    count<T extends TbCustGoldToAdjustCountArgs>(
      args?: Subset<T, TbCustGoldToAdjustCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TbCustGoldToAdjustCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TbCustGoldToAdjust.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustGoldToAdjustAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TbCustGoldToAdjustAggregateArgs>(args: Subset<T, TbCustGoldToAdjustAggregateArgs>): Prisma.PrismaPromise<GetTbCustGoldToAdjustAggregateType<T>>

    /**
     * Group by TbCustGoldToAdjust.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TbCustGoldToAdjustGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TbCustGoldToAdjustGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TbCustGoldToAdjustGroupByArgs['orderBy'] }
        : { orderBy?: TbCustGoldToAdjustGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TbCustGoldToAdjustGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTbCustGoldToAdjustGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TbCustGoldToAdjust model
   */
  readonly fields: TbCustGoldToAdjustFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TbCustGoldToAdjust.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TbCustGoldToAdjustClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TbCustGoldToAdjust model
   */
  interface TbCustGoldToAdjustFieldRefs {
    readonly itemId: FieldRef<"TbCustGoldToAdjust", 'Int'>
    readonly goldYear: FieldRef<"TbCustGoldToAdjust", 'Int'>
    readonly custId: FieldRef<"TbCustGoldToAdjust", 'String'>
    readonly currentGold: FieldRef<"TbCustGoldToAdjust", 'Float'>
    readonly pointDate: FieldRef<"TbCustGoldToAdjust", 'DateTime'>
    readonly note: FieldRef<"TbCustGoldToAdjust", 'String'>
    readonly pointType: FieldRef<"TbCustGoldToAdjust", 'String'>
    readonly createDate: FieldRef<"TbCustGoldToAdjust", 'DateTime'>
    readonly status2017: FieldRef<"TbCustGoldToAdjust", 'Int'>
    readonly expireDate: FieldRef<"TbCustGoldToAdjust", 'DateTime'>
    readonly remarck: FieldRef<"TbCustGoldToAdjust", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TbCustGoldToAdjust findUnique
   */
  export type TbCustGoldToAdjustFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustGoldToAdjust
     */
    select?: TbCustGoldToAdjustSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustGoldToAdjust
     */
    omit?: TbCustGoldToAdjustOmit<ExtArgs> | null
    /**
     * Filter, which TbCustGoldToAdjust to fetch.
     */
    where: TbCustGoldToAdjustWhereUniqueInput
  }

  /**
   * TbCustGoldToAdjust findUniqueOrThrow
   */
  export type TbCustGoldToAdjustFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustGoldToAdjust
     */
    select?: TbCustGoldToAdjustSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustGoldToAdjust
     */
    omit?: TbCustGoldToAdjustOmit<ExtArgs> | null
    /**
     * Filter, which TbCustGoldToAdjust to fetch.
     */
    where: TbCustGoldToAdjustWhereUniqueInput
  }

  /**
   * TbCustGoldToAdjust findFirst
   */
  export type TbCustGoldToAdjustFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustGoldToAdjust
     */
    select?: TbCustGoldToAdjustSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustGoldToAdjust
     */
    omit?: TbCustGoldToAdjustOmit<ExtArgs> | null
    /**
     * Filter, which TbCustGoldToAdjust to fetch.
     */
    where?: TbCustGoldToAdjustWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustGoldToAdjusts to fetch.
     */
    orderBy?: TbCustGoldToAdjustOrderByWithRelationInput | TbCustGoldToAdjustOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TbCustGoldToAdjusts.
     */
    cursor?: TbCustGoldToAdjustWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustGoldToAdjusts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustGoldToAdjusts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustGoldToAdjusts.
     */
    distinct?: TbCustGoldToAdjustScalarFieldEnum | TbCustGoldToAdjustScalarFieldEnum[]
  }

  /**
   * TbCustGoldToAdjust findFirstOrThrow
   */
  export type TbCustGoldToAdjustFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustGoldToAdjust
     */
    select?: TbCustGoldToAdjustSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustGoldToAdjust
     */
    omit?: TbCustGoldToAdjustOmit<ExtArgs> | null
    /**
     * Filter, which TbCustGoldToAdjust to fetch.
     */
    where?: TbCustGoldToAdjustWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustGoldToAdjusts to fetch.
     */
    orderBy?: TbCustGoldToAdjustOrderByWithRelationInput | TbCustGoldToAdjustOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TbCustGoldToAdjusts.
     */
    cursor?: TbCustGoldToAdjustWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustGoldToAdjusts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustGoldToAdjusts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustGoldToAdjusts.
     */
    distinct?: TbCustGoldToAdjustScalarFieldEnum | TbCustGoldToAdjustScalarFieldEnum[]
  }

  /**
   * TbCustGoldToAdjust findMany
   */
  export type TbCustGoldToAdjustFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustGoldToAdjust
     */
    select?: TbCustGoldToAdjustSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustGoldToAdjust
     */
    omit?: TbCustGoldToAdjustOmit<ExtArgs> | null
    /**
     * Filter, which TbCustGoldToAdjusts to fetch.
     */
    where?: TbCustGoldToAdjustWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TbCustGoldToAdjusts to fetch.
     */
    orderBy?: TbCustGoldToAdjustOrderByWithRelationInput | TbCustGoldToAdjustOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TbCustGoldToAdjusts.
     */
    cursor?: TbCustGoldToAdjustWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TbCustGoldToAdjusts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TbCustGoldToAdjusts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TbCustGoldToAdjusts.
     */
    distinct?: TbCustGoldToAdjustScalarFieldEnum | TbCustGoldToAdjustScalarFieldEnum[]
  }

  /**
   * TbCustGoldToAdjust create
   */
  export type TbCustGoldToAdjustCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustGoldToAdjust
     */
    select?: TbCustGoldToAdjustSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustGoldToAdjust
     */
    omit?: TbCustGoldToAdjustOmit<ExtArgs> | null
    /**
     * The data needed to create a TbCustGoldToAdjust.
     */
    data?: XOR<TbCustGoldToAdjustCreateInput, TbCustGoldToAdjustUncheckedCreateInput>
  }

  /**
   * TbCustGoldToAdjust createMany
   */
  export type TbCustGoldToAdjustCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TbCustGoldToAdjusts.
     */
    data: TbCustGoldToAdjustCreateManyInput | TbCustGoldToAdjustCreateManyInput[]
  }

  /**
   * TbCustGoldToAdjust update
   */
  export type TbCustGoldToAdjustUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustGoldToAdjust
     */
    select?: TbCustGoldToAdjustSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustGoldToAdjust
     */
    omit?: TbCustGoldToAdjustOmit<ExtArgs> | null
    /**
     * The data needed to update a TbCustGoldToAdjust.
     */
    data: XOR<TbCustGoldToAdjustUpdateInput, TbCustGoldToAdjustUncheckedUpdateInput>
    /**
     * Choose, which TbCustGoldToAdjust to update.
     */
    where: TbCustGoldToAdjustWhereUniqueInput
  }

  /**
   * TbCustGoldToAdjust updateMany
   */
  export type TbCustGoldToAdjustUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TbCustGoldToAdjusts.
     */
    data: XOR<TbCustGoldToAdjustUpdateManyMutationInput, TbCustGoldToAdjustUncheckedUpdateManyInput>
    /**
     * Filter which TbCustGoldToAdjusts to update
     */
    where?: TbCustGoldToAdjustWhereInput
    /**
     * Limit how many TbCustGoldToAdjusts to update.
     */
    limit?: number
  }

  /**
   * TbCustGoldToAdjust upsert
   */
  export type TbCustGoldToAdjustUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustGoldToAdjust
     */
    select?: TbCustGoldToAdjustSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustGoldToAdjust
     */
    omit?: TbCustGoldToAdjustOmit<ExtArgs> | null
    /**
     * The filter to search for the TbCustGoldToAdjust to update in case it exists.
     */
    where: TbCustGoldToAdjustWhereUniqueInput
    /**
     * In case the TbCustGoldToAdjust found by the `where` argument doesn't exist, create a new TbCustGoldToAdjust with this data.
     */
    create: XOR<TbCustGoldToAdjustCreateInput, TbCustGoldToAdjustUncheckedCreateInput>
    /**
     * In case the TbCustGoldToAdjust was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TbCustGoldToAdjustUpdateInput, TbCustGoldToAdjustUncheckedUpdateInput>
  }

  /**
   * TbCustGoldToAdjust delete
   */
  export type TbCustGoldToAdjustDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustGoldToAdjust
     */
    select?: TbCustGoldToAdjustSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustGoldToAdjust
     */
    omit?: TbCustGoldToAdjustOmit<ExtArgs> | null
    /**
     * Filter which TbCustGoldToAdjust to delete.
     */
    where: TbCustGoldToAdjustWhereUniqueInput
  }

  /**
   * TbCustGoldToAdjust deleteMany
   */
  export type TbCustGoldToAdjustDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TbCustGoldToAdjusts to delete
     */
    where?: TbCustGoldToAdjustWhereInput
    /**
     * Limit how many TbCustGoldToAdjusts to delete.
     */
    limit?: number
  }

  /**
   * TbCustGoldToAdjust without action
   */
  export type TbCustGoldToAdjustDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TbCustGoldToAdjust
     */
    select?: TbCustGoldToAdjustSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TbCustGoldToAdjust
     */
    omit?: TbCustGoldToAdjustOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable',
    Snapshot: 'Snapshot'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TbCustPointSilverCurrent2017ScalarFieldEnum: {
    itemId: 'itemId',
    custId: 'custId',
    currentPoint: 'currentPoint',
    xStatus: 'xStatus'
  };

  export type TbCustPointSilverCurrent2017ScalarFieldEnum = (typeof TbCustPointSilverCurrent2017ScalarFieldEnum)[keyof typeof TbCustPointSilverCurrent2017ScalarFieldEnum]


  export const TbCustPointGoldCurrent2017ScalarFieldEnum: {
    itemId: 'itemId',
    custId: 'custId',
    currentPoint: 'currentPoint',
    unfundedPoint: 'unfundedPoint',
    xStatus: 'xStatus'
  };

  export type TbCustPointGoldCurrent2017ScalarFieldEnum = (typeof TbCustPointGoldCurrent2017ScalarFieldEnum)[keyof typeof TbCustPointGoldCurrent2017ScalarFieldEnum]


  export const TbCustPointSilverCashCurrentScalarFieldEnum: {
    itemId: 'itemId',
    custId: 'custId',
    currentCashPoint: 'currentCashPoint',
    pointDate: 'pointDate',
    note: 'note',
    pointType: 'pointType',
    createDate: 'createDate',
    status2017: 'status2017',
    expireDate: 'expireDate'
  };

  export type TbCustPointSilverCashCurrentScalarFieldEnum = (typeof TbCustPointSilverCashCurrentScalarFieldEnum)[keyof typeof TbCustPointSilverCashCurrentScalarFieldEnum]


  export const TbCustGoldToAdjustScalarFieldEnum: {
    itemId: 'itemId',
    goldYear: 'goldYear',
    custId: 'custId',
    currentGold: 'currentGold',
    pointDate: 'pointDate',
    note: 'note',
    pointType: 'pointType',
    createDate: 'createDate',
    status2017: 'status2017',
    expireDate: 'expireDate',
    remarck: 'remarck'
  };

  export type TbCustGoldToAdjustScalarFieldEnum = (typeof TbCustGoldToAdjustScalarFieldEnum)[keyof typeof TbCustGoldToAdjustScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    
  /**
   * Deep Input Types
   */


  export type TbCustPointSilverCurrent2017WhereInput = {
    AND?: TbCustPointSilverCurrent2017WhereInput | TbCustPointSilverCurrent2017WhereInput[]
    OR?: TbCustPointSilverCurrent2017WhereInput[]
    NOT?: TbCustPointSilverCurrent2017WhereInput | TbCustPointSilverCurrent2017WhereInput[]
    itemId?: IntFilter<"TbCustPointSilverCurrent2017"> | number
    custId?: StringNullableFilter<"TbCustPointSilverCurrent2017"> | string | null
    currentPoint?: FloatNullableFilter<"TbCustPointSilverCurrent2017"> | number | null
    xStatus?: IntNullableFilter<"TbCustPointSilverCurrent2017"> | number | null
  }

  export type TbCustPointSilverCurrent2017OrderByWithRelationInput = {
    itemId?: SortOrder
    custId?: SortOrderInput | SortOrder
    currentPoint?: SortOrderInput | SortOrder
    xStatus?: SortOrderInput | SortOrder
  }

  export type TbCustPointSilverCurrent2017WhereUniqueInput = Prisma.AtLeast<{
    itemId?: number
    AND?: TbCustPointSilverCurrent2017WhereInput | TbCustPointSilverCurrent2017WhereInput[]
    OR?: TbCustPointSilverCurrent2017WhereInput[]
    NOT?: TbCustPointSilverCurrent2017WhereInput | TbCustPointSilverCurrent2017WhereInput[]
    custId?: StringNullableFilter<"TbCustPointSilverCurrent2017"> | string | null
    currentPoint?: FloatNullableFilter<"TbCustPointSilverCurrent2017"> | number | null
    xStatus?: IntNullableFilter<"TbCustPointSilverCurrent2017"> | number | null
  }, "itemId">

  export type TbCustPointSilverCurrent2017OrderByWithAggregationInput = {
    itemId?: SortOrder
    custId?: SortOrderInput | SortOrder
    currentPoint?: SortOrderInput | SortOrder
    xStatus?: SortOrderInput | SortOrder
    _count?: TbCustPointSilverCurrent2017CountOrderByAggregateInput
    _avg?: TbCustPointSilverCurrent2017AvgOrderByAggregateInput
    _max?: TbCustPointSilverCurrent2017MaxOrderByAggregateInput
    _min?: TbCustPointSilverCurrent2017MinOrderByAggregateInput
    _sum?: TbCustPointSilverCurrent2017SumOrderByAggregateInput
  }

  export type TbCustPointSilverCurrent2017ScalarWhereWithAggregatesInput = {
    AND?: TbCustPointSilverCurrent2017ScalarWhereWithAggregatesInput | TbCustPointSilverCurrent2017ScalarWhereWithAggregatesInput[]
    OR?: TbCustPointSilverCurrent2017ScalarWhereWithAggregatesInput[]
    NOT?: TbCustPointSilverCurrent2017ScalarWhereWithAggregatesInput | TbCustPointSilverCurrent2017ScalarWhereWithAggregatesInput[]
    itemId?: IntWithAggregatesFilter<"TbCustPointSilverCurrent2017"> | number
    custId?: StringNullableWithAggregatesFilter<"TbCustPointSilverCurrent2017"> | string | null
    currentPoint?: FloatNullableWithAggregatesFilter<"TbCustPointSilverCurrent2017"> | number | null
    xStatus?: IntNullableWithAggregatesFilter<"TbCustPointSilverCurrent2017"> | number | null
  }

  export type TbCustPointGoldCurrent2017WhereInput = {
    AND?: TbCustPointGoldCurrent2017WhereInput | TbCustPointGoldCurrent2017WhereInput[]
    OR?: TbCustPointGoldCurrent2017WhereInput[]
    NOT?: TbCustPointGoldCurrent2017WhereInput | TbCustPointGoldCurrent2017WhereInput[]
    itemId?: IntFilter<"TbCustPointGoldCurrent2017"> | number
    custId?: StringNullableFilter<"TbCustPointGoldCurrent2017"> | string | null
    currentPoint?: FloatNullableFilter<"TbCustPointGoldCurrent2017"> | number | null
    unfundedPoint?: FloatNullableFilter<"TbCustPointGoldCurrent2017"> | number | null
    xStatus?: IntNullableFilter<"TbCustPointGoldCurrent2017"> | number | null
  }

  export type TbCustPointGoldCurrent2017OrderByWithRelationInput = {
    itemId?: SortOrder
    custId?: SortOrderInput | SortOrder
    currentPoint?: SortOrderInput | SortOrder
    unfundedPoint?: SortOrderInput | SortOrder
    xStatus?: SortOrderInput | SortOrder
  }

  export type TbCustPointGoldCurrent2017WhereUniqueInput = Prisma.AtLeast<{
    itemId?: number
    AND?: TbCustPointGoldCurrent2017WhereInput | TbCustPointGoldCurrent2017WhereInput[]
    OR?: TbCustPointGoldCurrent2017WhereInput[]
    NOT?: TbCustPointGoldCurrent2017WhereInput | TbCustPointGoldCurrent2017WhereInput[]
    custId?: StringNullableFilter<"TbCustPointGoldCurrent2017"> | string | null
    currentPoint?: FloatNullableFilter<"TbCustPointGoldCurrent2017"> | number | null
    unfundedPoint?: FloatNullableFilter<"TbCustPointGoldCurrent2017"> | number | null
    xStatus?: IntNullableFilter<"TbCustPointGoldCurrent2017"> | number | null
  }, "itemId">

  export type TbCustPointGoldCurrent2017OrderByWithAggregationInput = {
    itemId?: SortOrder
    custId?: SortOrderInput | SortOrder
    currentPoint?: SortOrderInput | SortOrder
    unfundedPoint?: SortOrderInput | SortOrder
    xStatus?: SortOrderInput | SortOrder
    _count?: TbCustPointGoldCurrent2017CountOrderByAggregateInput
    _avg?: TbCustPointGoldCurrent2017AvgOrderByAggregateInput
    _max?: TbCustPointGoldCurrent2017MaxOrderByAggregateInput
    _min?: TbCustPointGoldCurrent2017MinOrderByAggregateInput
    _sum?: TbCustPointGoldCurrent2017SumOrderByAggregateInput
  }

  export type TbCustPointGoldCurrent2017ScalarWhereWithAggregatesInput = {
    AND?: TbCustPointGoldCurrent2017ScalarWhereWithAggregatesInput | TbCustPointGoldCurrent2017ScalarWhereWithAggregatesInput[]
    OR?: TbCustPointGoldCurrent2017ScalarWhereWithAggregatesInput[]
    NOT?: TbCustPointGoldCurrent2017ScalarWhereWithAggregatesInput | TbCustPointGoldCurrent2017ScalarWhereWithAggregatesInput[]
    itemId?: IntWithAggregatesFilter<"TbCustPointGoldCurrent2017"> | number
    custId?: StringNullableWithAggregatesFilter<"TbCustPointGoldCurrent2017"> | string | null
    currentPoint?: FloatNullableWithAggregatesFilter<"TbCustPointGoldCurrent2017"> | number | null
    unfundedPoint?: FloatNullableWithAggregatesFilter<"TbCustPointGoldCurrent2017"> | number | null
    xStatus?: IntNullableWithAggregatesFilter<"TbCustPointGoldCurrent2017"> | number | null
  }

  export type TbCustPointSilverCashCurrentWhereInput = {
    AND?: TbCustPointSilverCashCurrentWhereInput | TbCustPointSilverCashCurrentWhereInput[]
    OR?: TbCustPointSilverCashCurrentWhereInput[]
    NOT?: TbCustPointSilverCashCurrentWhereInput | TbCustPointSilverCashCurrentWhereInput[]
    itemId?: IntFilter<"TbCustPointSilverCashCurrent"> | number
    custId?: StringNullableFilter<"TbCustPointSilverCashCurrent"> | string | null
    currentCashPoint?: FloatNullableFilter<"TbCustPointSilverCashCurrent"> | number | null
    pointDate?: DateTimeNullableFilter<"TbCustPointSilverCashCurrent"> | Date | string | null
    note?: StringNullableFilter<"TbCustPointSilverCashCurrent"> | string | null
    pointType?: StringNullableFilter<"TbCustPointSilverCashCurrent"> | string | null
    createDate?: DateTimeNullableFilter<"TbCustPointSilverCashCurrent"> | Date | string | null
    status2017?: IntNullableFilter<"TbCustPointSilverCashCurrent"> | number | null
    expireDate?: DateTimeNullableFilter<"TbCustPointSilverCashCurrent"> | Date | string | null
  }

  export type TbCustPointSilverCashCurrentOrderByWithRelationInput = {
    itemId?: SortOrder
    custId?: SortOrderInput | SortOrder
    currentCashPoint?: SortOrderInput | SortOrder
    pointDate?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    pointType?: SortOrderInput | SortOrder
    createDate?: SortOrderInput | SortOrder
    status2017?: SortOrderInput | SortOrder
    expireDate?: SortOrderInput | SortOrder
  }

  export type TbCustPointSilverCashCurrentWhereUniqueInput = Prisma.AtLeast<{
    itemId?: number
    AND?: TbCustPointSilverCashCurrentWhereInput | TbCustPointSilverCashCurrentWhereInput[]
    OR?: TbCustPointSilverCashCurrentWhereInput[]
    NOT?: TbCustPointSilverCashCurrentWhereInput | TbCustPointSilverCashCurrentWhereInput[]
    custId?: StringNullableFilter<"TbCustPointSilverCashCurrent"> | string | null
    currentCashPoint?: FloatNullableFilter<"TbCustPointSilverCashCurrent"> | number | null
    pointDate?: DateTimeNullableFilter<"TbCustPointSilverCashCurrent"> | Date | string | null
    note?: StringNullableFilter<"TbCustPointSilverCashCurrent"> | string | null
    pointType?: StringNullableFilter<"TbCustPointSilverCashCurrent"> | string | null
    createDate?: DateTimeNullableFilter<"TbCustPointSilverCashCurrent"> | Date | string | null
    status2017?: IntNullableFilter<"TbCustPointSilverCashCurrent"> | number | null
    expireDate?: DateTimeNullableFilter<"TbCustPointSilverCashCurrent"> | Date | string | null
  }, "itemId">

  export type TbCustPointSilverCashCurrentOrderByWithAggregationInput = {
    itemId?: SortOrder
    custId?: SortOrderInput | SortOrder
    currentCashPoint?: SortOrderInput | SortOrder
    pointDate?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    pointType?: SortOrderInput | SortOrder
    createDate?: SortOrderInput | SortOrder
    status2017?: SortOrderInput | SortOrder
    expireDate?: SortOrderInput | SortOrder
    _count?: TbCustPointSilverCashCurrentCountOrderByAggregateInput
    _avg?: TbCustPointSilverCashCurrentAvgOrderByAggregateInput
    _max?: TbCustPointSilverCashCurrentMaxOrderByAggregateInput
    _min?: TbCustPointSilverCashCurrentMinOrderByAggregateInput
    _sum?: TbCustPointSilverCashCurrentSumOrderByAggregateInput
  }

  export type TbCustPointSilverCashCurrentScalarWhereWithAggregatesInput = {
    AND?: TbCustPointSilverCashCurrentScalarWhereWithAggregatesInput | TbCustPointSilverCashCurrentScalarWhereWithAggregatesInput[]
    OR?: TbCustPointSilverCashCurrentScalarWhereWithAggregatesInput[]
    NOT?: TbCustPointSilverCashCurrentScalarWhereWithAggregatesInput | TbCustPointSilverCashCurrentScalarWhereWithAggregatesInput[]
    itemId?: IntWithAggregatesFilter<"TbCustPointSilverCashCurrent"> | number
    custId?: StringNullableWithAggregatesFilter<"TbCustPointSilverCashCurrent"> | string | null
    currentCashPoint?: FloatNullableWithAggregatesFilter<"TbCustPointSilverCashCurrent"> | number | null
    pointDate?: DateTimeNullableWithAggregatesFilter<"TbCustPointSilverCashCurrent"> | Date | string | null
    note?: StringNullableWithAggregatesFilter<"TbCustPointSilverCashCurrent"> | string | null
    pointType?: StringNullableWithAggregatesFilter<"TbCustPointSilverCashCurrent"> | string | null
    createDate?: DateTimeNullableWithAggregatesFilter<"TbCustPointSilverCashCurrent"> | Date | string | null
    status2017?: IntNullableWithAggregatesFilter<"TbCustPointSilverCashCurrent"> | number | null
    expireDate?: DateTimeNullableWithAggregatesFilter<"TbCustPointSilverCashCurrent"> | Date | string | null
  }

  export type TbCustGoldToAdjustWhereInput = {
    AND?: TbCustGoldToAdjustWhereInput | TbCustGoldToAdjustWhereInput[]
    OR?: TbCustGoldToAdjustWhereInput[]
    NOT?: TbCustGoldToAdjustWhereInput | TbCustGoldToAdjustWhereInput[]
    itemId?: IntFilter<"TbCustGoldToAdjust"> | number
    goldYear?: IntNullableFilter<"TbCustGoldToAdjust"> | number | null
    custId?: StringNullableFilter<"TbCustGoldToAdjust"> | string | null
    currentGold?: FloatNullableFilter<"TbCustGoldToAdjust"> | number | null
    pointDate?: DateTimeNullableFilter<"TbCustGoldToAdjust"> | Date | string | null
    note?: StringNullableFilter<"TbCustGoldToAdjust"> | string | null
    pointType?: StringNullableFilter<"TbCustGoldToAdjust"> | string | null
    createDate?: DateTimeNullableFilter<"TbCustGoldToAdjust"> | Date | string | null
    status2017?: IntNullableFilter<"TbCustGoldToAdjust"> | number | null
    expireDate?: DateTimeNullableFilter<"TbCustGoldToAdjust"> | Date | string | null
    remarck?: StringNullableFilter<"TbCustGoldToAdjust"> | string | null
  }

  export type TbCustGoldToAdjustOrderByWithRelationInput = {
    itemId?: SortOrder
    goldYear?: SortOrderInput | SortOrder
    custId?: SortOrderInput | SortOrder
    currentGold?: SortOrderInput | SortOrder
    pointDate?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    pointType?: SortOrderInput | SortOrder
    createDate?: SortOrderInput | SortOrder
    status2017?: SortOrderInput | SortOrder
    expireDate?: SortOrderInput | SortOrder
    remarck?: SortOrderInput | SortOrder
  }

  export type TbCustGoldToAdjustWhereUniqueInput = Prisma.AtLeast<{
    itemId?: number
    AND?: TbCustGoldToAdjustWhereInput | TbCustGoldToAdjustWhereInput[]
    OR?: TbCustGoldToAdjustWhereInput[]
    NOT?: TbCustGoldToAdjustWhereInput | TbCustGoldToAdjustWhereInput[]
    goldYear?: IntNullableFilter<"TbCustGoldToAdjust"> | number | null
    custId?: StringNullableFilter<"TbCustGoldToAdjust"> | string | null
    currentGold?: FloatNullableFilter<"TbCustGoldToAdjust"> | number | null
    pointDate?: DateTimeNullableFilter<"TbCustGoldToAdjust"> | Date | string | null
    note?: StringNullableFilter<"TbCustGoldToAdjust"> | string | null
    pointType?: StringNullableFilter<"TbCustGoldToAdjust"> | string | null
    createDate?: DateTimeNullableFilter<"TbCustGoldToAdjust"> | Date | string | null
    status2017?: IntNullableFilter<"TbCustGoldToAdjust"> | number | null
    expireDate?: DateTimeNullableFilter<"TbCustGoldToAdjust"> | Date | string | null
    remarck?: StringNullableFilter<"TbCustGoldToAdjust"> | string | null
  }, "itemId">

  export type TbCustGoldToAdjustOrderByWithAggregationInput = {
    itemId?: SortOrder
    goldYear?: SortOrderInput | SortOrder
    custId?: SortOrderInput | SortOrder
    currentGold?: SortOrderInput | SortOrder
    pointDate?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    pointType?: SortOrderInput | SortOrder
    createDate?: SortOrderInput | SortOrder
    status2017?: SortOrderInput | SortOrder
    expireDate?: SortOrderInput | SortOrder
    remarck?: SortOrderInput | SortOrder
    _count?: TbCustGoldToAdjustCountOrderByAggregateInput
    _avg?: TbCustGoldToAdjustAvgOrderByAggregateInput
    _max?: TbCustGoldToAdjustMaxOrderByAggregateInput
    _min?: TbCustGoldToAdjustMinOrderByAggregateInput
    _sum?: TbCustGoldToAdjustSumOrderByAggregateInput
  }

  export type TbCustGoldToAdjustScalarWhereWithAggregatesInput = {
    AND?: TbCustGoldToAdjustScalarWhereWithAggregatesInput | TbCustGoldToAdjustScalarWhereWithAggregatesInput[]
    OR?: TbCustGoldToAdjustScalarWhereWithAggregatesInput[]
    NOT?: TbCustGoldToAdjustScalarWhereWithAggregatesInput | TbCustGoldToAdjustScalarWhereWithAggregatesInput[]
    itemId?: IntWithAggregatesFilter<"TbCustGoldToAdjust"> | number
    goldYear?: IntNullableWithAggregatesFilter<"TbCustGoldToAdjust"> | number | null
    custId?: StringNullableWithAggregatesFilter<"TbCustGoldToAdjust"> | string | null
    currentGold?: FloatNullableWithAggregatesFilter<"TbCustGoldToAdjust"> | number | null
    pointDate?: DateTimeNullableWithAggregatesFilter<"TbCustGoldToAdjust"> | Date | string | null
    note?: StringNullableWithAggregatesFilter<"TbCustGoldToAdjust"> | string | null
    pointType?: StringNullableWithAggregatesFilter<"TbCustGoldToAdjust"> | string | null
    createDate?: DateTimeNullableWithAggregatesFilter<"TbCustGoldToAdjust"> | Date | string | null
    status2017?: IntNullableWithAggregatesFilter<"TbCustGoldToAdjust"> | number | null
    expireDate?: DateTimeNullableWithAggregatesFilter<"TbCustGoldToAdjust"> | Date | string | null
    remarck?: StringNullableWithAggregatesFilter<"TbCustGoldToAdjust"> | string | null
  }

  export type TbCustPointSilverCurrent2017CreateInput = {
    custId?: string | null
    currentPoint?: number | null
    xStatus?: number | null
  }

  export type TbCustPointSilverCurrent2017UncheckedCreateInput = {
    itemId?: number
    custId?: string | null
    currentPoint?: number | null
    xStatus?: number | null
  }

  export type TbCustPointSilverCurrent2017UpdateInput = {
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    xStatus?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TbCustPointSilverCurrent2017UncheckedUpdateInput = {
    itemId?: IntFieldUpdateOperationsInput | number
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    xStatus?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TbCustPointSilverCurrent2017CreateManyInput = {
    custId?: string | null
    currentPoint?: number | null
    xStatus?: number | null
  }

  export type TbCustPointSilverCurrent2017UpdateManyMutationInput = {
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    xStatus?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TbCustPointSilverCurrent2017UncheckedUpdateManyInput = {
    itemId?: IntFieldUpdateOperationsInput | number
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    xStatus?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TbCustPointGoldCurrent2017CreateInput = {
    custId?: string | null
    currentPoint?: number | null
    unfundedPoint?: number | null
    xStatus?: number | null
  }

  export type TbCustPointGoldCurrent2017UncheckedCreateInput = {
    itemId?: number
    custId?: string | null
    currentPoint?: number | null
    unfundedPoint?: number | null
    xStatus?: number | null
  }

  export type TbCustPointGoldCurrent2017UpdateInput = {
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    unfundedPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    xStatus?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TbCustPointGoldCurrent2017UncheckedUpdateInput = {
    itemId?: IntFieldUpdateOperationsInput | number
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    unfundedPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    xStatus?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TbCustPointGoldCurrent2017CreateManyInput = {
    custId?: string | null
    currentPoint?: number | null
    unfundedPoint?: number | null
    xStatus?: number | null
  }

  export type TbCustPointGoldCurrent2017UpdateManyMutationInput = {
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    unfundedPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    xStatus?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TbCustPointGoldCurrent2017UncheckedUpdateManyInput = {
    itemId?: IntFieldUpdateOperationsInput | number
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    unfundedPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    xStatus?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type TbCustPointSilverCashCurrentCreateInput = {
    custId?: string | null
    currentCashPoint?: number | null
    pointDate?: Date | string | null
    note?: string | null
    pointType?: string | null
    createDate?: Date | string | null
    status2017?: number | null
    expireDate?: Date | string | null
  }

  export type TbCustPointSilverCashCurrentUncheckedCreateInput = {
    itemId?: number
    custId?: string | null
    currentCashPoint?: number | null
    pointDate?: Date | string | null
    note?: string | null
    pointType?: string | null
    createDate?: Date | string | null
    status2017?: number | null
    expireDate?: Date | string | null
  }

  export type TbCustPointSilverCashCurrentUpdateInput = {
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentCashPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    pointDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    pointType?: NullableStringFieldUpdateOperationsInput | string | null
    createDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status2017?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TbCustPointSilverCashCurrentUncheckedUpdateInput = {
    itemId?: IntFieldUpdateOperationsInput | number
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentCashPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    pointDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    pointType?: NullableStringFieldUpdateOperationsInput | string | null
    createDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status2017?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TbCustPointSilverCashCurrentCreateManyInput = {
    custId?: string | null
    currentCashPoint?: number | null
    pointDate?: Date | string | null
    note?: string | null
    pointType?: string | null
    createDate?: Date | string | null
    status2017?: number | null
    expireDate?: Date | string | null
  }

  export type TbCustPointSilverCashCurrentUpdateManyMutationInput = {
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentCashPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    pointDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    pointType?: NullableStringFieldUpdateOperationsInput | string | null
    createDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status2017?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TbCustPointSilverCashCurrentUncheckedUpdateManyInput = {
    itemId?: IntFieldUpdateOperationsInput | number
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentCashPoint?: NullableFloatFieldUpdateOperationsInput | number | null
    pointDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    pointType?: NullableStringFieldUpdateOperationsInput | string | null
    createDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status2017?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TbCustGoldToAdjustCreateInput = {
    goldYear?: number | null
    custId?: string | null
    currentGold?: number | null
    pointDate?: Date | string | null
    note?: string | null
    pointType?: string | null
    createDate?: Date | string | null
    status2017?: number | null
    expireDate?: Date | string | null
    remarck?: string | null
  }

  export type TbCustGoldToAdjustUncheckedCreateInput = {
    itemId?: number
    goldYear?: number | null
    custId?: string | null
    currentGold?: number | null
    pointDate?: Date | string | null
    note?: string | null
    pointType?: string | null
    createDate?: Date | string | null
    status2017?: number | null
    expireDate?: Date | string | null
    remarck?: string | null
  }

  export type TbCustGoldToAdjustUpdateInput = {
    goldYear?: NullableIntFieldUpdateOperationsInput | number | null
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentGold?: NullableFloatFieldUpdateOperationsInput | number | null
    pointDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    pointType?: NullableStringFieldUpdateOperationsInput | string | null
    createDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status2017?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remarck?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TbCustGoldToAdjustUncheckedUpdateInput = {
    itemId?: IntFieldUpdateOperationsInput | number
    goldYear?: NullableIntFieldUpdateOperationsInput | number | null
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentGold?: NullableFloatFieldUpdateOperationsInput | number | null
    pointDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    pointType?: NullableStringFieldUpdateOperationsInput | string | null
    createDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status2017?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remarck?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TbCustGoldToAdjustCreateManyInput = {
    goldYear?: number | null
    custId?: string | null
    currentGold?: number | null
    pointDate?: Date | string | null
    note?: string | null
    pointType?: string | null
    createDate?: Date | string | null
    status2017?: number | null
    expireDate?: Date | string | null
    remarck?: string | null
  }

  export type TbCustGoldToAdjustUpdateManyMutationInput = {
    goldYear?: NullableIntFieldUpdateOperationsInput | number | null
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentGold?: NullableFloatFieldUpdateOperationsInput | number | null
    pointDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    pointType?: NullableStringFieldUpdateOperationsInput | string | null
    createDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status2017?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remarck?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TbCustGoldToAdjustUncheckedUpdateManyInput = {
    itemId?: IntFieldUpdateOperationsInput | number
    goldYear?: NullableIntFieldUpdateOperationsInput | number | null
    custId?: NullableStringFieldUpdateOperationsInput | string | null
    currentGold?: NullableFloatFieldUpdateOperationsInput | number | null
    pointDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    pointType?: NullableStringFieldUpdateOperationsInput | string | null
    createDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status2017?: NullableIntFieldUpdateOperationsInput | number | null
    expireDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    remarck?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TbCustPointSilverCurrent2017CountOrderByAggregateInput = {
    itemId?: SortOrder
    custId?: SortOrder
    currentPoint?: SortOrder
    xStatus?: SortOrder
  }

  export type TbCustPointSilverCurrent2017AvgOrderByAggregateInput = {
    itemId?: SortOrder
    currentPoint?: SortOrder
    xStatus?: SortOrder
  }

  export type TbCustPointSilverCurrent2017MaxOrderByAggregateInput = {
    itemId?: SortOrder
    custId?: SortOrder
    currentPoint?: SortOrder
    xStatus?: SortOrder
  }

  export type TbCustPointSilverCurrent2017MinOrderByAggregateInput = {
    itemId?: SortOrder
    custId?: SortOrder
    currentPoint?: SortOrder
    xStatus?: SortOrder
  }

  export type TbCustPointSilverCurrent2017SumOrderByAggregateInput = {
    itemId?: SortOrder
    currentPoint?: SortOrder
    xStatus?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type TbCustPointGoldCurrent2017CountOrderByAggregateInput = {
    itemId?: SortOrder
    custId?: SortOrder
    currentPoint?: SortOrder
    unfundedPoint?: SortOrder
    xStatus?: SortOrder
  }

  export type TbCustPointGoldCurrent2017AvgOrderByAggregateInput = {
    itemId?: SortOrder
    currentPoint?: SortOrder
    unfundedPoint?: SortOrder
    xStatus?: SortOrder
  }

  export type TbCustPointGoldCurrent2017MaxOrderByAggregateInput = {
    itemId?: SortOrder
    custId?: SortOrder
    currentPoint?: SortOrder
    unfundedPoint?: SortOrder
    xStatus?: SortOrder
  }

  export type TbCustPointGoldCurrent2017MinOrderByAggregateInput = {
    itemId?: SortOrder
    custId?: SortOrder
    currentPoint?: SortOrder
    unfundedPoint?: SortOrder
    xStatus?: SortOrder
  }

  export type TbCustPointGoldCurrent2017SumOrderByAggregateInput = {
    itemId?: SortOrder
    currentPoint?: SortOrder
    unfundedPoint?: SortOrder
    xStatus?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TbCustPointSilverCashCurrentCountOrderByAggregateInput = {
    itemId?: SortOrder
    custId?: SortOrder
    currentCashPoint?: SortOrder
    pointDate?: SortOrder
    note?: SortOrder
    pointType?: SortOrder
    createDate?: SortOrder
    status2017?: SortOrder
    expireDate?: SortOrder
  }

  export type TbCustPointSilverCashCurrentAvgOrderByAggregateInput = {
    itemId?: SortOrder
    currentCashPoint?: SortOrder
    status2017?: SortOrder
  }

  export type TbCustPointSilverCashCurrentMaxOrderByAggregateInput = {
    itemId?: SortOrder
    custId?: SortOrder
    currentCashPoint?: SortOrder
    pointDate?: SortOrder
    note?: SortOrder
    pointType?: SortOrder
    createDate?: SortOrder
    status2017?: SortOrder
    expireDate?: SortOrder
  }

  export type TbCustPointSilverCashCurrentMinOrderByAggregateInput = {
    itemId?: SortOrder
    custId?: SortOrder
    currentCashPoint?: SortOrder
    pointDate?: SortOrder
    note?: SortOrder
    pointType?: SortOrder
    createDate?: SortOrder
    status2017?: SortOrder
    expireDate?: SortOrder
  }

  export type TbCustPointSilverCashCurrentSumOrderByAggregateInput = {
    itemId?: SortOrder
    currentCashPoint?: SortOrder
    status2017?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type TbCustGoldToAdjustCountOrderByAggregateInput = {
    itemId?: SortOrder
    goldYear?: SortOrder
    custId?: SortOrder
    currentGold?: SortOrder
    pointDate?: SortOrder
    note?: SortOrder
    pointType?: SortOrder
    createDate?: SortOrder
    status2017?: SortOrder
    expireDate?: SortOrder
    remarck?: SortOrder
  }

  export type TbCustGoldToAdjustAvgOrderByAggregateInput = {
    itemId?: SortOrder
    goldYear?: SortOrder
    currentGold?: SortOrder
    status2017?: SortOrder
  }

  export type TbCustGoldToAdjustMaxOrderByAggregateInput = {
    itemId?: SortOrder
    goldYear?: SortOrder
    custId?: SortOrder
    currentGold?: SortOrder
    pointDate?: SortOrder
    note?: SortOrder
    pointType?: SortOrder
    createDate?: SortOrder
    status2017?: SortOrder
    expireDate?: SortOrder
    remarck?: SortOrder
  }

  export type TbCustGoldToAdjustMinOrderByAggregateInput = {
    itemId?: SortOrder
    goldYear?: SortOrder
    custId?: SortOrder
    currentGold?: SortOrder
    pointDate?: SortOrder
    note?: SortOrder
    pointType?: SortOrder
    createDate?: SortOrder
    status2017?: SortOrder
    expireDate?: SortOrder
    remarck?: SortOrder
  }

  export type TbCustGoldToAdjustSumOrderByAggregateInput = {
    itemId?: SortOrder
    goldYear?: SortOrder
    currentGold?: SortOrder
    status2017?: SortOrder
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
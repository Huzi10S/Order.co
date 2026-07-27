/**
 * Environment-aware collection name helper.
 *
 * When NEXT_PUBLIC_FIREBASE_ENV === "dev", all collection names are prefixed
 * with "dev_" so reads/writes go to dev_orders, dev_products, etc.
 * Production (default) uses unprefixed names.
 */

const isDev =
  typeof process !== "undefined" &&
  process.env?.NEXT_PUBLIC_FIREBASE_ENV === "dev";

const PREFIX = isDev ? "dev_" : "";

/** Returns the environment-aware collection name */
export function col(name) {
  return `${PREFIX}${name}`;
}

/** Pre-resolved collection names for convenience */
export const COLLECTIONS = {
  orders: col("orders"),
  products: col("products"),
  settings: col("settings"),
  priceUpdateLog: col("priceUpdateLog"),
  priceUpdateBackups: col("priceUpdateBackups"),
};

/** True when running against dev-prefixed collections */
export const IS_DEV = isDev;

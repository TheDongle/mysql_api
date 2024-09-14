declare global {
  interface Reply<T> {
    "2xx": { data: T };
    "4xx": { error: string };
    "5xx": { error: string };
  }
  type NODE_ENV = "production" | "development";
}

export const arrayWrap = (maybeArray: Array<any> | any): Array<any> =>
  Array.isArray(maybeArray) ? maybeArray : [maybeArray];

export const stringGuard = (s: string | undefined): s is string => typeof s === "string";

export interface PreparedQuery {
  sql: string;
  values?: Array<string | number>;
}

export const prepareQuery = (sqlString: string, values: any): PreparedQuery => {
  if (values === undefined) {
    return { sql: sqlString };
  }
  return { sql: sqlString, values: arrayWrap(values) };
};

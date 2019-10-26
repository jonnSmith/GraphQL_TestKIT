import * as I from './interfaces';
export declare const ResultMessage: I.Result;
export declare const ErrorMessage: I.Result;
export declare function responseFactory(status: string | undefined, key: 'message' | 'path' | 'schema', value: any, promise?: boolean): Promise<I.Result> | I.Result;
export declare const ROOT: string;
export declare const ARTILLERY_BIN: string;
export declare const ARTILLERY_SCHEMA = "artillery.schema.gql";
export declare const ARTILLERY_CONFIG = "config.json";
export declare const ARTILLERY_SETTINGS = "artillery.yml";
export declare const OUTPUT_FILE_DATE = "YYYY_MM_DD_HH_MM_SS";
export declare const SANDBOX_PATH: string;
export declare const ARTILLERY_FOLDER = "artillery";
export declare const SCHEMA_FOLDER = "schema";
export declare const QUERIES_REPORT_FILENAME = "easygraphql-load-tester-queries";
export declare const MEOW_TESTKIT_FLAGS: {
    flags: {
        config: {
            type: string;
            alias: string;
        };
        schema: {
            type: string;
            alias: string;
        };
        update: {
            type: string;
            alias: string;
            default: boolean;
        };
        report: {
            type: string;
            alias: string;
            default: boolean;
        };
        file: {
            type: string;
            alias: string;
        };
    };
};
export declare const MEOW_TESTKIT_HELP = "\nUsage: \n  $ gql-testkit --c=graphql.test.config.json --s=schema.gql --u=true\n\nTestKit for GraphQL server endpoints testing\n\nOptions:\n  --config, -c    JSON config file path\n  --schema, -s    GraphQL Schema file path\n  --update  -u    Schema update flag\n  --report  -r    Report flag, check if only report needed\n  --file    -f    JSON report file name, works only with -r flag\n";

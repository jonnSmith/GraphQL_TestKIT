import * as I from './interfaces'
import * as path from 'path'
import { ping } from './observers'

export const ResultMessage: I.Result = messageFactory('ok' )
export const ErrorMessage: I.Result = messageFactory('err' )

function messageFactory(status) {
  const builder: Partial<I.Result> = {} as Partial<I.Result>;
  builder.status = status;
  return builder as I.Result
}

export function responseFactory(status: string = 'ok', key: 'message' | 'path' | 'schema', value, promise = true): Promise<I.Result> | I.Result {
  if (value && typeof value === "object") {
    if(value.status) { return promise ? Promise.resolve(value) : value }
  }
  if(key && key === 'message' && !value) { value = 'Unknown ' + key }
  const messageObject: Partial<I.Result> = messageFactory(status)
  let responseObject
  if(key && value) {
    responseObject = { ...messageObject, ...{[key]: value.toString()} }
  }
  if(status === 'err') {
    ping.emit('error', responseObject && responseObject.message ? responseObject.message : JSON.stringify(messageObject))
  }
  return promise ? Promise.resolve(responseObject as I.Result) : responseObject as I.Result;
}

export const ROOT = path.resolve()
export const ARTILLERY_BIN =  path.join(ROOT, 'node_modules/.bin/artillery')
export const ARTILLERY_SCHEMA = 'artillery.schema.gql'
export const ARTILLERY_CONFIG = 'config.json'
export const ARTILLERY_SETTINGS = 'artillery.yml'
export const OUTPUT_FILE_DATE = 'YYYY_MM_DD_HH_MM_SS'

export const SANDBOX_PATH = path.join(__dirname, '..', '..', 'sandbox')
export const ARTILLERY_FOLDER = 'artillery'
export const SCHEMA_FOLDER = 'schema'

export const QUERIES_REPORT_FILENAME = 'easygraphql-load-tester-queries'

export const MEOW_TESTKIT_FLAGS = {
  flags: {
    config: {
      type: 'string',
      alias: 'c'
    },
    schema: {
      type: 'string',
      alias: 's'
    },
    update: {
      type: 'boolean',
      alias: 'u',
      default: false
    },
    report: {
      type: 'boolean',
      alias: 'r',
      default: false
    },
    file: {
      type: 'string',
      alias: 'f'
    }
  }
}

export const MEOW_TESTKIT_HELP = `
Usage: 
  $ gql-testkit --c=graphql.test.config.json --s=schema.gql --u=true

TestKit for GraphQL server endpoints testing

Options:
  --config, -c    JSON config file path
  --schema, -s    GraphQL Schema file path
  --update  -u    Schema update flag
  --report  -r    Report flag, check if only report needed
  --file    -f    JSON report file name, works only with -r flag
`
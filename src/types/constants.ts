import * as I from './interfaces'
import * as path from 'path'
import { ping, loading } from './observers'

function messageFactory(status) {
  const builder: Partial<I.Result> = {} as Partial<I.Result>;
  builder.status = status;
  return builder as I.Result
}

export function responseFactory(status: string = 'info', key: 'message' | 'path' | 'schema' | 'loading', value, promise = true): Promise<I.Result> | I.Result {
  if (value && typeof value === "object") {
    if(value.status) {
      return promise ? Promise.resolve(value) : value
    } else if(key === 'loading' && value.id && value.text) {
      loading.emit(status, value)
    }
  }
  if(key && key === 'message' && !value) { value = 'Unknown ' + key }
  const messageObject: Partial<I.Result> = messageFactory(status)
  let responseObject
  if(key && value) {
    responseObject = { ...messageObject, ...{[key]: value.toString()} }
  }
  if(status === 'error') {
    ping.emit('error', responseObject && responseObject.message ? responseObject.message : JSON.stringify(messageObject))
  }
  return promise ? Promise.resolve(responseObject as I.Result) : responseObject as I.Result;
}

export const ROOT = path.resolve()
export const ARTILLERY_BIN =  path.join(ROOT, 'node_modules/.bin/artillery')
export const ARTILLERY_SCHEMA = 'artillery.schema.gql'
export const ARTILLERY_CONFIG = 'config.json'
export const ARTILLERY_SETTINGS = 'artillery.yml'
export const ARTILLERY_SETTINGS_SOURCE = 'artillery.config.json'
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
  $ gql-testkit --c=gql.config.json --s=schema.gql --u=true

TestKit for GraphQL server endpoints testing

Options:
  --config, -c    JSON config file path
  --schema, -s    GraphQL Schema file path
  --update  -u    Schema update flag
  --report  -r    Report flag, check if only report needed
  --file    -f    JSON report file name, works only with -r flag
`

export const CONFIG_MOCK_FILENAME = 'gql.config.json';
export const CONFIG_MOCK = {
  config: {
    name: "Testing GraphQL with Artillery",
    url: "http://localhost:3000/graphql",
    selectedQueries: ["signin", "signup", "user"],
    queryFile: true,
    withMutations: true,
    duration: 1,
    arrivalRate: 1,
    withOutput: true,
    outputFolder: "tests-gql-report",
    appRootOutput: false,
    target: "http://localhost:3000/",
    headers: {
      Authorization: "bearer {TOKEN}"
    },
    schema: {
      filename: "schema.graphql",
      method: "POST",
      json: false
    }
  },
  args: {
    signin: {
      email: "test@test.com",
      password: "123456"
    },
    signup: {
      email: "test@test.com",
      password: "123456",
      firstName: "John",
      secondName: "Smith"
    },
    user: {
      id: "5e774d286bc20f3e2491da53",
    }
  }
}

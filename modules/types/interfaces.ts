export interface Options {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: { [key: string]: string }
  json?: boolean
}

export interface Flag {
  [key: string]: {
    type: string
    alias?: string
    default?: any
  }
}

export interface Result {
  status: string
  message?: string
  path?: string
  schema?: string
}

export interface ConfigFile {
  config: {
    url: string
    name: string
    selectedQueries: Array<string>
    queryFile: boolean
    queryFilePath?: string
    withMutations: boolean
    duration: number
    arrivalRate: number
    withOutput: boolean
    outputFolder: string
    headers: { [key: string]: string }
    schema: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
      json?: boolean
      filename: string
    }
    args: { [key: string]: any }
  }
}
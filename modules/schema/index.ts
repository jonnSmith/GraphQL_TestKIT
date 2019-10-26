import * as path from 'path'
import fetch from 'node-fetch'
import * as fs from 'fs'
import mkdirp from 'mkdirp'
import { introspectionQuery } from 'graphql/utilities/introspectionQuery'
import { buildClientSchema } from 'graphql/utilities/buildClientSchema'
import { printSchema } from 'graphql/utilities/schemaPrinter'

import * as I from '../types/interfaces'
import * as C from '../types/constants'

export async function schemaGQL(configFile: I.ConfigFile): Promise<I.Result> {

  const config = configFile.config

  if (!config.url) {
    return C.responseFactory('err', 'message', 'No endpoint provided')
  }

  /* Headers */
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const headers = {
    ...config.headers,
    ...defaultHeaders
  }

  let schema: I.Result
  try {
     schema = await getRemoteSchema(config.url, {
       method: config.schema.method,
       headers,
       json: config.schema.json,
     })
  } catch(e) {
    return C.responseFactory('err', 'message', e)
  }

  if (!schema || schema.status === 'err') {
    return C.responseFactory('err', 'message', schema.message)
  } else {
    if (config.schema.filename && schema.schema) {
      const printedFile: I.Result = printToFile(config.schema.filename, schema.schema)
      return C.responseFactory('ok', 'path', printedFile)
    } else {
      return C.responseFactory('err', 'message', 'Error: ' + JSON.stringify(schema))
    }
  }
}

async function getRemoteSchema(
  endpoint: string,
  options: I.Options,
): Promise<I.Result> {
  const { data, errors } = await fetch(endpoint, {
    method: options.method,
    headers: options.headers,
    body: JSON.stringify({ query: introspectionQuery }),
  }).then(res => res.json())

  if (errors) {
    return C.responseFactory('err', 'message', JSON.stringify(errors, null, 2))
  }

  if (options.json) {
    return C.responseFactory('ok', 'schema', JSON.stringify(data, null, 2))
  } else {
    const schema = buildClientSchema(data)
    return C.responseFactory('ok', 'schema', printSchema(schema))
  }
}

function printToFile(
  filename: string,
  schema: string,
): I.Result {
  try {
    const output = path.join(C.SANDBOX_PATH, C.SCHEMA_FOLDER)
    const filePath = path.join(C.SANDBOX_PATH, C.SCHEMA_FOLDER, filename)
    if (!fs.existsSync(filePath)) {
      mkdirp.sync(output)
    }
    fs.writeFileSync(filePath, schema)
    return C.responseFactory('ok', 'path', filePath, false) as I.Result
  } catch (e) {
    return C.responseFactory('err', 'message', e, false) as I.Result
  }
}

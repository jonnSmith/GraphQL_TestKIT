import { schemaGQL } from './schema'
import * as path from 'path'
import * as fs from 'fs-extra'
import { loading } from './types/observers'

import { startLoadTesting } from './artillery'
import * as I from './types/interfaces'
import * as C from './types/constants'

export async function testKitGQL(cli): Promise<I.Result> {

  loading.emit('init', { text: 'Preparing configs and paths', id: 'startup' })

  const configPath = cli.flags.c ? cli.flags.c : ''
  const localSchema = cli.flags.s ? cli.flags.s : ''
  const updateSchema = cli.flags.u ? cli.flags.u : false

  const configFilePath = configPath ? path.join(C.ROOT, configPath) : ''
  const localSchemaPath = localSchema ? path.join(C.ROOT, localSchema) : ''
  const isLocalSchema = localSchemaPath ? fs.existsSync(localSchemaPath) : false

  if (!configPath || !configPath.includes('.json') || !fs.existsSync(configFilePath)) {
    return C.responseFactory('err', 'message', 'No config provided')
  }

  let configFile: I.ConfigFile
  try {
    configFile = await fs.readJSON(configFilePath, { encoding: 'utf8'})
  } catch(e) {
    return C.responseFactory('err', 'message', e)
  }

  const testName = configFile.config.name ? configFile.config.name : configFile.config.url
  const schemaFilename = configFile.config.schema.filename
  const schemaFilenamePath = schemaFilename ? path.join(C.SANDBOX_PATH, C.SCHEMA_FOLDER, schemaFilename) : ''
  const isSchemaFilename = schemaFilenamePath ? fs.existsSync(schemaFilenamePath) : false;

  loading.emit('succeed', 'startup')

  if(!isLocalSchema && (!isSchemaFilename || (isSchemaFilename && updateSchema))) {
    loading.emit('init', { text: `Preparing download GraphQL Schema for: ${testName}`, id: 'schema' })
    let schemaResult: I.Result
    try {
      schemaResult = await schemaGQL(configFile)
    } catch(e) {
      return C.responseFactory('err', 'message', e)
    }
    loading.emit('succeed', 'schema')

    if(schemaResult && schemaResult.path) {
      return startLoadTesting(configFile, schemaResult.path, configPath)
    } else {
      return C.responseFactory('err', 'message', 'Schema saving error')
    }

  } else if(isLocalSchema) {
    return startLoadTesting(configFile, localSchemaPath, configPath)
  } else if(isSchemaFilename) {
    return startLoadTesting(configFile, schemaFilenamePath, configPath)
  } else {
    return C.responseFactory('err', 'message', 'No schema provided')
  }
}


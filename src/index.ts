import { schemaGQL } from './schema'
import * as path from 'path'
import * as fs from 'fs-extra'
import rp from 'request-promise'

import { startLoadTesting } from './artillery'
import { reportGQL } from './report'
import * as I from './types/interfaces'
import * as C from './types/constants'
import { loading } from './types/observers'

export async function testKitGQL(cli): Promise<I.Result> {

  loading.emit('init', { text: 'Preparing configs and paths', id: 'startup' })

  const configPath = cli.flags.c ? cli.flags.c : ''
  const localSchema = cli.flags.s ? cli.flags.s : ''
  const updateSchema = cli.flags.u ? cli.flags.u : false

  const report = cli.flags.r ? cli.flags.r : false
  const reportFilename = cli.flags.f ? cli.flags.f : ''

  const configFilePath = configPath ? path.join(C.ROOT, configPath) : ''
  const localSchemaPath = localSchema ? path.join(C.ROOT, localSchema) : ''
  const isLocalSchema = localSchemaPath ? fs.existsSync(localSchemaPath) : false

  if (!configPath || !configPath.includes('.json') || !fs.existsSync(configFilePath)) {
    const basicConfigPath = path.join(C.ROOT, C.CONFIG_MOCK_FILENAME);
    if(!fs.existsSync(basicConfigPath)) {
      fs.writeJsonSync(path.join(C.ROOT, C.CONFIG_MOCK_FILENAME), C.CONFIG_MOCK, {encoding: 'utf8'})
      return C.responseFactory('error', 'message', 'No config provided, basic file created: ' + C.CONFIG_MOCK_FILENAME)
    } else {
      return C.responseFactory('error', 'message', 'Config path ' + configPath + ' is empty, use created basic config: ' + C.CONFIG_MOCK_FILENAME)
    }
  }

  let configFile: I.ConfigFile
  try {
    configFile = fs.readJSONSync(configFilePath, { encoding: 'utf8'})
  } catch(e) {
    return C.responseFactory('error', 'message', e)
  }

  try {
    await rp({ url: configFile.config.url, resolveWithFullResponse: false });
  } catch(e) {
    if(e.cause && e.cause.errno === 'ENOTFOUND') {
      return C.responseFactory('error', 'message', 'Provided url in config is invalid: ENOTFOUND. Update GraphQL endpoint url.')
    }
  }

  if (report) {
    loading.emit('succeed', { id: 'startup' })
    return reportGQL(configFile, reportFilename)
  }

  const testName = configFile.config.name ? configFile.config.name : configFile.config.url
  const schemaFilename = configFile.config.schema.filename
  const schemaFilenamePath = schemaFilename ? path.join(C.SANDBOX_PATH, C.SCHEMA_FOLDER, schemaFilename) : ''
  const isSchemaFilename = schemaFilenamePath ? fs.existsSync(schemaFilenamePath) : false;

  loading.emit('succeed', { id: 'startup' })

  if(!isLocalSchema && (!isSchemaFilename || (isSchemaFilename && updateSchema))) {
    loading.emit('init', { text: `Preparing download GraphQL Schema for: ${testName}`, id: 'schema' })
    let schemaResult: I.Result
    try {
      schemaResult = await schemaGQL(configFile)
    } catch(e) {
      return C.responseFactory('error', 'message', e)
    }
    loading.emit('succeed', { id: 'schema' })

    if(schemaResult && schemaResult.path) {
      return startLoadTesting(configFile, schemaResult.path, configPath)
    } else {
      return C.responseFactory('error', 'message', 'Schema saving error')
    }

  } else if(isLocalSchema) {
    return startLoadTesting(configFile, localSchemaPath, configPath)
  } else if(isSchemaFilename) {
    return startLoadTesting(configFile, schemaFilenamePath, configPath)
  } else {
    return C.responseFactory('error', 'message', 'No schema provided')
  }
}

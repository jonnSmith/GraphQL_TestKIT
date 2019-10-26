import * as path from 'path'
import * as fs from 'fs-extra'
import { spawn } from 'child_process'
import moment from 'moment'
import * as yaml from 'js-yaml'

import * as I from '../types/interfaces'
import * as C from '../types/constants'
import { loading, ping } from '../types/observers'

const artilleryConfigPath = (fileName = '') => path.join(C.SANDBOX_PATH, C.ARTILLERY_FOLDER, fileName)

export async function startLoadTesting (configFile: I.ConfigFile, localSchema: string, configPath: string): Promise<I.Result> {
  const { config: { url, name, outputFolder, appRootOutput } } = configFile
  const testName = name ? name : url
  loading.emit('init', { text: `Preparing Artillery stress tests for: ${testName}`, id: 'artillery' })

  const schemaPath = artilleryConfigPath(C.ARTILLERY_SCHEMA)
  const reportsFolder = path.join(appRootOutput ? C.ROOT : C.SANDBOX_PATH, outputFolder)
  await fs.copyFile(localSchema, schemaPath, (err) => {
    if (err) {
      return C.responseFactory('error', 'message', err)
    }
  })
  return runLoadTesting(configFile, reportsFolder, configPath)
}

export async function runLoadTesting(configFile, reportsFolder, configPath): Promise<I.Result> {

  const newConfigFilePath = artilleryConfigPath(C.ARTILLERY_CONFIG)
  if (configFile.config.queryFile) {
    configFile.config['queryFilePath'] = reportsFolder
  }

  let newConfigFile: I.ConfigFile
  try {
    fs.writeJSONSync(newConfigFilePath, configFile, { encoding: 'utf8'})
    newConfigFile = fs.readJSONSync(newConfigFilePath, { encoding: 'utf8'})
  } catch(e) {
    deleteArgsFile(C.ARTILLERY_SCHEMA)
      .then( e => deleteArgsFile(C.ARTILLERY_CONFIG) )
      .then( e => C.responseFactory('info', 'message', 'config and schema deleted') )
    return C.responseFactory('error', 'message', e)
  }

  const { config: { name, url, duration = 5, arrivalRate = 10, withOutput, queryFilePath, target, headers } } = newConfigFile

  let artilleryYML
  try {
    artilleryYML = fs.readJSONSync(path.join(C.SANDBOX_PATH, '..', C.ARTILLERY_SETTINGS_SOURCE), { encoding: 'utf8'});
  } catch(e) {
    deleteArgsFile(C.ARTILLERY_SCHEMA)
      .then( e => deleteArgsFile(C.ARTILLERY_CONFIG) )
      .then( e => C.responseFactory('info', 'message', 'config and schema deleted') )
    return C.responseFactory('error', 'message', e)
  }

  artilleryYML.config.target = target

  let options = [
    'run',
    '--target',
    `${url}`,
    C.ARTILLERY_SETTINGS
  ]

  artilleryYML.config.phases = [{ duration, arrivalRate }]

  if (headers) {
    artilleryYML.config.defaults = { headers }
  }

  let reportPath
  let reportFile
  if (withOutput) {
    const date = moment().format(C.OUTPUT_FILE_DATE).toString()
    reportFile = `${date}.json`
    reportPath = path.join(reportsFolder, reportFile)
    options = options.concat(['--output', reportPath])
  }

  await fs.writeFile(artilleryConfigPath(C.ARTILLERY_SETTINGS), yaml.safeDump(artilleryYML), (err) => {
    if (err) {
      deleteArgsFile(C.ARTILLERY_CONFIG)
        .then( e => deleteArgsFile(C.ARTILLERY_SCHEMA) )
        .then( e => deleteArgsFile(C.ARTILLERY_SETTINGS) )
        .then( e => C.responseFactory('info', 'message', 'config and schema deleted') )
      return C.responseFactory('error', 'message', err )
    }
  });

  const artilleryRun = spawn(C.ARTILLERY_BIN, options, {
    shell: true,
    cwd: artilleryConfigPath()
  })

  loading.emit('succeed', { id: 'artillery' })

  let i = 0
  artilleryRun.stdout.on('data', (data) => {
    if (!i) { loading.emit('succeed', { id: 'spawn' }) }
    ping.emit('info', data.toString())
    i++
  })

  let k = 0
  artilleryRun.stderr.on('data', (data) => {
    if (!k) { loading.emit('fail', { id: 'spawn' }) }
    ping.emit('error', data.toString())
    k++
  })

  artilleryRun.on('exit', code => {
    if (code === 0) {
      if (withOutput && reportPath) {
        ping.emit('info', `Full report run: "yarn run gql-testkit -c=${configPath} -r -f=${reportFile}"`)
      }
      if (queryFilePath) {
        ping.emit('info', `Query file: ${queryFilePath}\\${C.QUERIES_REPORT_FILENAME}.json`)
      }
    }
    deleteArgsFile(C.ARTILLERY_CONFIG)
      .then( e => deleteArgsFile(C.ARTILLERY_SCHEMA) )
      .then( e => deleteArgsFile(C.ARTILLERY_SETTINGS) )
      .then( e => C.responseFactory('info', 'message', 'Config and schema deleted' ) )
  })

  artilleryRun.on('close', _ => {
    ping.emit('info', name + ' tests running finished. Thanks for using GraphQL TestKit.')
  })

  return C.responseFactory('init', 'loading', { text: 'Starting Artillery child process spawn for ' + name, id: 'spawn' })
}

async function deleteArgsFile (fileName): Promise<string> {
  const filePath = artilleryConfigPath(fileName)
  let removeResult = 'file ' + fileName + ' deleted'
  await fs.remove(filePath, err => {
    removeResult = JSON.stringify(err)
  })
  return removeResult;
}
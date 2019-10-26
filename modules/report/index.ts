import * as path from 'path'
import * as fs from 'fs-extra'
import moment from 'moment'
import inquirer from 'inquirer'
import { spawn } from 'child_process'

import { loading, ping } from '../types/observers'
import * as I from '../types/interfaces'
import * as C from '../types/constants'

export async function reportGQL(cli): Promise<I.Result> {
  const configPath = cli.flags.c ? cli.flags.c : ''
  const configFilePath = configPath ? path.join(C.ROOT, configPath) : ''
  let reportFile = cli.flags.f ? cli.flags.f : ''

  loading.emit('init', {text: 'Reading config file', id: 'startport'})

  if (!configPath || !configPath.includes('.json') || !fs.existsSync(configFilePath)) {
    return C.responseFactory('err', 'message', 'No config provided')
  }
  let configFile: I.ConfigFile

  try {
    configFile = await fs.readJSON(configFilePath, {encoding: 'utf8'})
  } catch (e) {
    return C.responseFactory('err', 'message', e)
  }
  const {config: {name, outputFolder}} = configFile;
  if (!outputFolder) {
    return C.responseFactory('err', 'message', 'Reports folder not configured')
  }
  const reportsFolder = path.join(C.SANDBOX_PATH, outputFolder)
  const isReportsFolder = await fs.pathExists(reportsFolder)
  if (!isReportsFolder) {
    return C.responseFactory('err', 'message', 'Reports folder not exists')
  }

  loading.emit('succeed', 'startport')

  if(!reportFile || !reportFile.includes('.json')) {

    loading.emit('init', {text: 'Reading report files directory', id: 'filepath'})

    let files = await fs.readdir(reportsFolder);
    files = files.filter(f =>
      !f.includes(C.QUERIES_REPORT_FILENAME)
      && f.includes('.json')
      && moment(f.replace('.json', ''), C.OUTPUT_FILE_DATE, true).isValid()
    )
    if (!files.length) {
      return C.responseFactory('err', 'message', 'No reports found in folder')
    }
    const questions: Array<inquirer.ListQuestion> = []
    const options: inquirer.ListQuestion = {
      type: 'list',
      name: 'reportFile',
      message: 'Report file:',
      choices: files
    }
    questions.push(options)

    loading.emit('succeed', 'filepath')

    const answers = await inquirer.prompt(questions)
    reportFile = answers['reportFile'];
  }

  const reportFilePath = path.join(reportsFolder, reportFile)

  if(!fs.existsSync(reportFilePath) ) {
    return C.responseFactory('err', 'message', 'Report file doesnt exists')
  }

  const report = spawn(
    C.ARTILLERY_BIN,
    [
      'report',
      reportFilePath
    ],
    {
      shell: true
    }
  )

  report.stdout.on('data', (data) => {
    ping.emit('info', data.toString())
  })

  report.stderr.on('data', (data) => {
    ping.emit('error', data.toString())
  })

  report.on('close', code => {
    ping.emit('info', 'Report generation finished')
  })

  return C.responseFactory('ok', 'message', reportFile + ' reports generating:')

}
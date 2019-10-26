import * as path from 'path'
import * as fs from 'fs-extra'
import moment from 'moment'
import inquirer from 'inquirer'
import { spawn } from 'child_process'

import { loading, ping } from '../types/observers'
import * as I from '../types/interfaces'
import * as C from '../types/constants'

export async function reportGQL(configFile, reportFilename): Promise<I.Result> {
  let reportFile = reportFilename

  const {config: { outputFolder, appRootOutput}} = configFile;
  if (!outputFolder) {
    return C.responseFactory('error', 'message', 'Reports folder not configured')
  }
  const reportsFolder = path.join(appRootOutput ? C.ROOT : C.SANDBOX_PATH, outputFolder)
  const isReportsFolder = await fs.pathExists(reportsFolder)
  if (!isReportsFolder) {
    return C.responseFactory('error', 'message', 'Reports folder not exists')
  }

  if(!reportFile || !reportFile.includes('.json')) {

    loading.emit('init', {text: 'Reading report files directory', id: 'filepath'})

    let files = await fs.readdir(reportsFolder);
    files = files.filter(f =>
      !f.includes(C.QUERIES_REPORT_FILENAME)
      && f.includes('.json')
      && moment(f.replace('.json', ''), C.OUTPUT_FILE_DATE, true).isValid()
    )
    if (!files.length) {
      return C.responseFactory('error', 'message', 'No reports found in folder')
    }
    const questions: Array<inquirer.ListQuestion> = []
    const options: inquirer.ListQuestion = {
      type: 'list',
      name: 'reportFile',
      message: 'Report file:',
      choices: files
    }
    questions.push(options)

    loading.emit('succeed', { id: 'filepath' })

    const answers = await inquirer.prompt(questions)
    reportFile = answers['reportFile'];
  }

  const reportFilePath = path.join(reportsFolder, reportFile)

  if(!fs.existsSync(reportFilePath) ) {
    return C.responseFactory('error', 'message', 'Report file does not exists')
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

  let i = 0
  report.stdout.on('data', (data) => {
    if (!i) { loading.emit('succeed', { id: 'respawn' }) }
    ping.emit('info', data.toString())
    i++
  })

  let k = 0
  report.stderr.on('data', (data) => {
    if (!k) { loading.emit('fail', { id: 'spawn' }) }
    ping.emit('error', data.toString())
    k++
  })

  report.on('close', _ => {
    ping.emit('info', 'Report generating finished. Check opened browser window.')
  })

  return C.responseFactory('init', 'loading', { text: 'Starting report child process for ' + reportFile, id: 'respawn' })

}
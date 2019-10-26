'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp');
const EasyGraphQLLoadTester = require('easygraphql-load-tester')

const C = require('../../dist/types/constants.js');

const { config: { outputFolder, selectedQueries, queryFile, queryFilePath, appRootOutput, withMutations }, args } = require(path.join(path.resolve(), C.ARTILLERY_CONFIG))
const schema = fs.readFileSync(path.join(path.resolve(), C.ARTILLERY_SCHEMA), 'utf8')
const easyGraphQLLoadTester = new EasyGraphQLLoadTester(schema, args)

const reportPath = appRootOutput ? path.join(path.resolve(), '..', '..', outputFolder) : path.join(path.resolve(), '..', outputFolder)
if (!fs.existsSync(reportPath)) {
  mkdirp.sync(reportPath)
}

const options = {
  selectedQueries,
  queryFile,
  queryFilePath,
  withMutations
}

const testCases = easyGraphQLLoadTester.artillery(options)
module.exports = {
  testCases
}

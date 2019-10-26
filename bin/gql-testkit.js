#!/usr/bin/env node

'use strict'
const meow = require('meow')
const kit = require('../dist')
const report = require('../dist/report')
const O = require('../dist/types/observers')
const C = require('../dist/types/constants')

const cli = meow(C.MEOW_TESTKIT_HELP, C.MEOW_TESTKIT_FLAGS)

if (cli.flags.r) {
  report.reportGQL(cli).then(r => {
    if(r && r.status && r.message) {
      O.ping.emit(r.status === 'err' ? 'error' : 'info', r.message)
    }
  })
} else {
  kit.testKitGQL(cli).then(a => {
    if(a && a.status && a.message) {
      O.ping.emit(a.status === 'err' ? 'error' : 'info', a.message)
    }
  })
}
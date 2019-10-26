#!/usr/bin/env node

'use strict'
const meow = require('meow')
const kit = require('../dist')
const O = require('../dist/types/observers')
const C = require('../dist/types/constants')

const cli = meow(C.MEOW_TESTKIT_HELP, C.MEOW_TESTKIT_FLAGS)

kit.testKitGQL(cli).then(a => {
  if(a && a.status && a.message) {
    O.ping.emit(a.status, a.message)
  }
})
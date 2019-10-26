import { EventEmitter } from 'events';
import ora, { Ora } from 'ora'

export const ping = new EventEmitter();
export const loading = new EventEmitter();

let spinners = new Map<string, Ora>();
let spinner: Ora | undefined

ping.on('info', i => {
  console.log('\n' + i);
})

ping.on('warning', w => {
  console.debug('\nWarning:', w);
})

ping.on('error', e => {
  console.error('\nError:', e);
  spinners.forEach((s) => {
    s.fail()
  });
  spinners.clear()
})

loading.on('init', ({ text, id }) => {
  spinners.set(id, ora(text).start())
})

loading.on('stop', (id) => {
  spinner = spinners.get(id)
  spinner ? spinner.stop() : ''
})

loading.on('start', (id) => {
  spinner = spinners.get(id)
  spinner ? spinner.start() : ''
})

loading.on('succeed', (id) => {
  spinner = spinners.get(id)
  spinner ? spinner.succeed() : ''
  spinner = undefined
  spinners.delete(id)
})

loading.on('fail', (id) => {
  spinner = spinners.get(id)
  spinner ? spinner.fail() : ''
  spinner = undefined
  spinners.delete(id)
})
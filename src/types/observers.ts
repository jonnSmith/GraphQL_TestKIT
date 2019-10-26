import { EventEmitter } from 'events';
import ora, { Ora } from 'ora'

export const ping = new EventEmitter();
export const loading = new EventEmitter();

let spinners = new Map<string, Ora>();
let spinner: Ora | undefined

let iBuffer
ping.on('info', i => {
  if(!i || i === iBuffer) { return }
  console.log('\nInfo: ' + i);
  iBuffer = i
})

let wBuffer
ping.on('warning', w => {
  if(!w || w === wBuffer) { return }
  console.debug('\nWarning: ', w);
  wBuffer = w
})

let eBuffer
ping.on('error', e => {
  if(!e || e === eBuffer) { return }
  console.error('\nError: ', e);
  spinners.forEach((s) => {
    s.fail()
  });
  spinners.clear()
  eBuffer = e
})

loading.on('init', ({ text, id }) => {
  spinners.set(id, ora(text).start())
})

loading.on('stop', ({ id }) => {
  spinner = spinners.get(id)
  spinner ? spinner.stop() : ''
})

loading.on('start', ({ id }) => {
  spinner = spinners.get(id)
  spinner ? spinner.start() : ''
})

loading.on('succeed', ({ id }) => {
  spinner = spinners.get(id)
  spinner ? spinner.succeed() : ''
  spinner = undefined
  spinners.delete(id)
})

loading.on('fail', ({ id }) => {
  spinner = spinners.get(id)
  spinner ? spinner.fail() : ''
  spinner = undefined
  spinners.delete(id)
})
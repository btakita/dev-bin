#!/usr/bin/env bun
import { clipboard__read, clipboard__write } from '../clipboard/index.js'
const kebob = await clipboard__read()
const underscore = kebob.replaceAll('-', '_')
await clipboard__write(underscore)
console.info(underscore)

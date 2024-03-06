#!/usr/bin/env bun
import clipboard from 'clipboardy'
const kebob = await clipboard.read()
const underscore = kebob.replaceAll('-', '_')
clipboard.write(underscore)
console.info(underscore)

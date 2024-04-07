#!/usr/bin/env bun
import { clipboard__write } from '../clipboard/index.js'
const iso_datetime = new Date().toISOString()
await clipboard__write(iso_datetime)
console.info(iso_datetime)

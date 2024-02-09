#!/usr/bin/env bun
import clipboard from 'clipboardy'
const iso_datetime = new Date().toISOString()
await clipboard.write(iso_datetime)
console.info(iso_datetime)

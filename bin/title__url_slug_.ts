#!/usr/bin/env bun
import { convert } from 'url-slug'
import { clipboard__read, clipboard__write } from '../clipboard/index.js'
const title = await clipboard__read()
const slug = convert(title)
await clipboard__write(slug)
console.info(slug)

#!/usr/bin/env bun
import clipboard from 'clipboardy'
import { convert } from 'url-slug'
const title = await clipboard.read()
const slug = convert(title)
await clipboard.write(slug)
console.info(slug)

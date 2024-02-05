#!/usr/bin/env bun
import clipboard from 'clipboardy'
const line = await clipboard.read()
await clipboard.write(
	line
		.replace(/^'/, '')
		.replace(/'$/, '')
		.split(' ')
		.map(_class=>`'${_class}'`)
		.join(',\n'))

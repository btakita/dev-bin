#!/usr/bin/env bun
import { is_entry_file_ } from 'ctx-core/fs'
import { clipboard__read, clipboard__write } from '../clipboard/index.js'
export function tw_class_line__split(line:string) {
	return line
		.replace(/^'/, '')
		.replace(/'$/, '')
		.split(' ')
		.map(_class=>`'${_class}'`)
		.join(',\n')
}
if (is_entry_file_(import.meta.url, process.argv[1])) {
	clipboard__write(tw_class_line__split(await clipboard__read()))
		.then(()=>process.exit(0))
		.catch(err=>{
			console.error(err)
			process.exit(1)
		})
}

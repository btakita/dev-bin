#!/usr/bin/env bun
import clipboard from 'clipboardy'
import { is_entry_file_ } from 'ctx-core/fs'
export function tw_class_line__split(line:string) {
	return line
		.replace(/^'/, '')
		.replace(/'$/, '')
		.split(' ')
		.map(_class=>`'${_class}'`)
		.join(',\n')
}
if (is_entry_file_(import.meta.url, process.argv[1])) {
	clipboard.write(tw_class_line__split(await clipboard.read()))
		.then(()=>process.exit(0))
		.catch(err=>{
			console.error(err)
			process.exit(1)
		})
}

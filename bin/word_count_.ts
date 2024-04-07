#!/usr/bin/env bun
import { response__drain } from '@rappstack/domain--server/response'
import { is_entry_file_ } from 'ctx-core/fs'
import { Marked } from 'marked'
import { clipboard__read } from '../clipboard/index.js'
export async function word_count_(md:string) {
	const marked = new Marked()
	const html = await marked.parse(md)
	let text = ''
	const rw =
		new HTMLRewriter()
			.on('*', {
				text(_text) {
					text += _text.text ?? ''
				}
			})
	await response__drain(
		rw.transform(new Response(html)))
	return text.split(/\s+/).length
}
if (is_entry_file_(import.meta.url, process.argv[1])) {
	console.info(await word_count_(await clipboard__read()) + ' words')
}

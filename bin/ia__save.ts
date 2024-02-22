#!/usr/bin/env bun
import { param_r_ } from 'ctx-core/cli-args'
import { queue_ } from 'ctx-core/queue'
const param_r = param_r_(Bun.argv.slice(2), {
	help: '-h, --help',
	sitemap_a1: '-s, --sitemap'
})
main()
	.then(()=>process.exit(0))
	.catch(err=>{
		console.error(err)
		process.exit(1)
	})
async function main() {
	if (param_r.help) {
		console.info(help_msg_())
		return
	}
	const sitemap_url = param_r.sitemap_a1?.[0]
	if (!sitemap_url) {
		throw Error('-s,--sitemap not provided')
	}
	const sitemap_response = await fetch(sitemap_url)
	if (!sitemap_response.ok) {
		throw Error('sitemap_url error response: GET ' + sitemap_url + ' ' + sitemap_response.status)
	}
	const queue = queue_(17)
	let keep_open__resolve:(value:unknown)=>void
	queue.add(()=>new Promise(resolve=>keep_open__resolve = resolve))
		.catch(err=>console.error(err))
	const rw = new HTMLRewriter()
		.on('loc', {
			text(node) {
				const { text } = node
				if (text) {
					queue.add(()=>
						fetch('https://web.archive.org/save/' + text)
							.then(res=>console.info(res.headers.get('Content-Location')))
							.catch(err=>{
								console.error(err)
							}))
				}
			}
		})
	const xml = await sitemap_response.text()
	rw.transform(
		new Response(
			xml.replace(/(<\/?)[^:]*:/g, '$1')))
	keep_open__resolve!(undefined)
	await queue.close()
}
function help_msg_() {
	return `
Usage: ia__save [-s <sitemap-url>]

Options:

-h, --help    This help message
-s, --sitemap Sitemap URL to archive
		`.trim()
}

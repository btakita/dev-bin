#!/usr/bin/env bun
import { sleep } from 'bun'
import { param_r_ } from 'ctx-core/cli-args'
import { run } from 'ctx-core/function'
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
	const queue = queue_(2)
	let keep_open__resolve:(value:unknown)=>void
	queue.add(()=>new Promise(resolve=>keep_open__resolve = resolve))
		.catch(err=>console.error(err))
	const rw = new HTMLRewriter()
		.on('loc', {
			text(node) {
				const { text } = node
				if (text) {
					queue.add(async ()=>{
						const save_url = 'https://web.archive.org/save/' + text
						await fetch(save_url)
							.then(res=>{
								if (res.ok) {
									console.info(response_header_link__parse(res.headers.get('link') ?? ''))
								} else {
									console.error(res.status + ': ' + save_url)
								}
							})
							.catch(err=>console.error(err))
						await sleep(5)
					})
				}
			}
		})
	const xml = await sitemap_response.text()
	const rw_response = rw.transform(
		new Response(
			xml
				.replaceAll(/<[^>]*:/g, '<')
				.replaceAll(/<\/[^>]*:/g, '</')))
	await run(async ()=>{
		const reader = rw_response.body!.getReader()
		while (!(await reader.read()).done) {
			/* empty */
		}
	})
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
function response_header_link__parse(header:string):{ [key:string]:link_o_T; } {
	const result:{ [key:string]:link_o_T; } = {}
	if (header.length === 0) {
		return result
	}
	// Split parts by comma not enclosed by quotes
	const link_a1 = header.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
	for (const link of link_a1) {
		const part_a1 = link.split(';')
		const link_o:link_o_T = {
			url: part_a1[0].trim().replace(/<(.*)>/, '$1')
		}
		part_a1.shift()
		for (const part of part_a1) {
			// Split part by first equals sign.
			const [name, ...values] = part.split('=')
			const value = values.join('=').trim().replace(/"/g, '')
			link_o[name.trim()] = value
		}
		result[link_o.rel] = link_o
	}
	return result
}
type link_o_T = { url:string }&Record<string, string>
// console.info(response_header_link__parse(
// 	'<https://briantakita.me/posts/subversion-source-control>; rel="original", <https://web.archive.org/web/timemap/link/https://briantakita.me/posts/subversion-source-control>; rel="timemap"; type="application/link-format", <https://web.archive.org/web/https://briantakita.me/posts/subversion-source-control>; rel="timegate", <https://web.archive.org/web/20240222044519/http://briantakita.me/posts/subversion-source-control>; rel="first memento"; datetime="Thu, 22 Feb 2024 04:45:19 GMT", <https://web.archive.org/web/20240222044519/http://briantakita.me/posts/subversion-source-control>; rel="prev memento"; datetime="Thu, 22 Feb 2024 04:45:19 GMT", <https://web.archive.org/web/20240222044520/https://briantakita.me/posts/subversion-source-control>; rel="memento"; datetime="Thu, 22 Feb 2024 04:45:20 GMT", <https://web.archive.org/web/20240222044520/https://briantakita.me/posts/subversion-source-control>; rel="last memento"; datetime="Thu, 22 Feb 2024 04:45:20 GMT"'
// ))

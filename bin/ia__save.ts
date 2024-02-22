#!/usr/bin/env bun
import { sleep } from 'bun'
import { param_r_ } from 'ctx-core/cli-args'
import { run } from 'ctx-core/function'
const param_r = param_r_(Bun.argv.slice(2), {
	help: '-h, --help',
	sitemap_a1: '-s, --sitemap',
	txt_a1: '-t, --txt',
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
	const txt_path = param_r.txt_a1?.[0]
	if (!sitemap_url && !txt_path) {
		throw Error('-s,--sitemap & -t,--txt not provided')
	}
	const queue = rate_limit_queue_(3, 3, 10_000)
	const error_url_a1:string[] = []
	let keep_open__resolve:(value:unknown)=>void
	queue.add(()=>new Promise(resolve=>keep_open__resolve = resolve))
	if (sitemap_url) await sitemap_url__process()
	if (txt_path) await txt_path__process()
	keep_open__resolve!(undefined)
	await queue.close()
	if (error_url_a1.length) {
		console.error('Save error occurred for:\n' + error_url_a1.join('\n'))
	}
	async function sitemap_url__process() {
		const sitemap_response = await fetch(sitemap_url)
		if (!sitemap_response.ok) {
			throw Error('sitemap_url error response: GET ' + sitemap_url + ' ' + sitemap_response.status)
		}
		const rw = new HTMLRewriter()
			.on('loc', {
				text(node) {
					const url = node.text
					if (url) {
						queue.add(async ()=>{
							const save_url = 'https://web.archive.org/save/' + url
							await fetch(save_url)
								.then(res=>{
									if (res.ok) {
										console.info(response_header_link__parse(res.headers.get('link') ?? ''))
									} else {
										error_url_a1.push(url)
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
	}
	async function txt_path__process() {
		const url_a1 = await Bun.file(txt_path).text().then(txt=>txt.split('\n'))
		for (const url of url_a1) {
			if (url) {
				queue.add(async ()=>{
					const save_url = 'https://web.archive.org/save/' + url
					await fetch(save_url)
						.then(res=>{
							if (res.ok) {
								console.info(response_header_link__parse(res.headers.get('link') ?? ''))
							} else {
								error_url_a1.push(url)
								console.error(res.status + ': ' + save_url)
							}
						}).catch(err=>console.error(err))
					await sleep(5)
				})
			}
		}
	}
}
function help_msg_() {
	return `
Usage: ia__save [-s <sitemap-url>]

Options:

-h, --help    This help message
-s, --sitemap Sitemap URL to archive
-t, --txt     Path to urls to archive
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
function rate_limit_queue_(max_concurrent:number, per_interval:number, interval:number) {
	let interval_start_ms = new Date().getTime()
	let now_ = ()=>new Date().getTime()
	let running_count = 0
	let interval_started_count = 0
	let queue:(()=>Promise<unknown>)[] = []
	let close__resolve:(arg:unknown)=>void
	let is_closed = false
	function add(fn:()=>Promise<unknown>) {
		if (is_closed) {
			console.warn('The queue is closed. New tasks cannot be added.')
			return
		}
		let now = now_()
		if (
			running_count <= max_concurrent
			&& (
				(now - interval_start_ms < interval && interval_started_count < per_interval) ||
				now - interval_start_ms >= interval
			)
		) {
			run(fn)
		} else {
			queue.push(fn)
		}
		if (!running_count) {
			setTimeout(()=>add(queue.shift()!), interval_start_ms + interval - now)
		}
	}
	function run(fn:()=>Promise<unknown>) {
		running_count++
		let now = now_()
		if (now - interval_start_ms >= interval) {
			interval_start_ms = now
			interval_started_count = 0
		}
		interval_started_count++
		fn().then(()=>{
			running_count--
			if (queue.length > 0) {
				add(queue.shift()!)
			} else if (!running_count) {
				close__resolve(undefined)
			}
		})
	}
	let close_promise:Promise<unknown>
	function close() {
		return close_promise ??= new Promise(resolve=>{
			if (queue.length === 0 && running_count === 0) {
				resolve(undefined)
			} else {
				close__resolve = (val:unknown)=>{
					is_closed = true
					resolve(val)
				}
			}
		})
	}
	return {
		add,
		close,
	}
}

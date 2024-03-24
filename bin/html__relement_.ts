#!/usr/bin/env bun
import { response__drain } from '@rappstack/domain--server/response'
import clipboard from 'clipboardy'
import { is_entry_file_ } from 'ctx-core/fs'
import { tw_class_line__split } from './tw_class_line__split.js'
import Element = HTMLRewriterTypes.Element
import EndTag = HTMLRewriterTypes.EndTag
const lower_tagName_R_camel_tagName:Record<string, string|undefined> = {
	'animatemotion': 'animateMotion',
	'animatetransform': 'animateTransform',
	'clippath': 'clipPath',
	'fecolormatrix': 'feColorMatrix',
	'fecomponenttransfer': 'feComponentTransfer',
	'fecomposite': 'feComposite',
	'feconvolvematrix': 'feConvolveMatrix',
	'fediffuselighting': 'feDiffuseLighting',
	'fedisplacementmap': 'feDisplacementMap',
	'fedistantlight': 'feDistantLight',
	'fedropshadow': 'feDropShadow',
	'feflood': 'feFlood',
	'fefunca': 'feFuncA',
	'fefuncb': 'feFuncB',
	'fefuncg': 'feFuncG',
	'fefuncr': 'feFuncR',
	'fegaussianblur': 'feGaussianBlur',
	'feimage': 'feImage',
	'femerge': 'feMerge',
	'femergenode': 'feMergeNode',
	'femorphology': 'feMorphology',
	'feoffset': 'feOffset',
	'fepointlight': 'fePointLight',
	'fespecularlighting': 'feSpecularLighting',
	'fespotlight': 'feSpotLight',
	'fetile': 'feTile',
	'feturbulence': 'feTurbulence',
	'foreignobject': 'foreignObject',
	'lineargradient': 'linearGradient',
	'radialgradient': 'radialGradient',
}
const lower_attr_R_attr:Record<string, string|undefined> = {
	'viewbox': 'viewBox'
}
export async function html__relement_(html:string) {
	let relement = ''
	let stack:{ has_attr:boolean, child_count:number }[] = []
	let pending_comment_text:string|undefined
	function tos_() {
		return stack[stack.length - 1]
	}
	const rw = new HTMLRewriter()
		.on('*', {
			comments(comment) {
				pending_comment_text = (pending_comment_text ?? '') + `/* ${comment.text} */\n`
			},
			element(element):void|Promise<void> {
				if (stack.length) {
					const tos = tos_()
					if (tos.has_attr || tos.child_count) {
						relement += ','
					}
					if (!tos.child_count) {
						if (tos.has_attr) {
							relement += ' '
						}
						relement += '['
					}
					relement += '\n'
				}
				if (pending_comment_text) {
					relement += pending_comment_text
					pending_comment_text = undefined
				}
				stack.push({ has_attr: false, child_count: 0 })
				relement += '  '.repeat(stack.length - 1)
				const tagName = element.tagName
				relement += lower_tagName_R_camel_tagName[tagName] ?? tagName
				relement += '_('
				let attribute_count = 0
				let key:string|undefined = undefined
				for (const [_key, value] of element.attributes) {
					key = lower_attr_R_attr[_key] ?? _key
					if (!attribute_count) {
						relement += '{'
					} else {
						relement += ','
					}
					if (key === 'class') {
						relement += `\n${'  '.repeat(stack.length)}`
					} else {
						relement += ' '
					}
					++attribute_count
					relement +=
						!key || /[^a-zA-Z_]/.test(key[0]) || /[^a-zA-Z_0-9]/.test(key)
							? `'${key}'`
							: key
					relement += ': '
					relement +=
						key === 'class'
							? `class_(\n${
								tw_class_line__split(value)
									.split('\n')
									.map(line=>'  '.repeat(stack.length + 1) + line)
									.join('\n')})`
							: `'${value.replaceAll('\'', '\\\'')}'`
				}
				if (attribute_count) {
					if (key === 'class') {
						relement += '\n' + '  '.repeat(stack.length)
					} else {
						relement += ' '
					}
					relement += '}'
					tos_().has_attr = true
				}
				if (element.selfClosing) {
					onEndTag(element)
				} else {
					element.onEndTag(onEndTag)
				}
			},
			text(text):void|Promise<void> {
				const trim_text = text.text.trim()
				if (trim_text) {
					if (stack.length) {
						const tos = tos_()
						if (tos.has_attr || tos.child_count) {
							relement += ','
						}
						if (!tos.child_count) {
							if (tos.has_attr) {
								relement += ' '
							}
							relement += '['
						}
						relement += '\n'
					}
					tos_().child_count++
					relement += '  '.repeat(stack.length)
					relement += `\`${trim_text.replaceAll('`', '\`')}\``
				}
			},
		})
	await response__drain(
		rw.transform(new Response(html)))
	return relement
	function onEndTag(tag:Element|EndTag) {
		const { child_count } = stack.pop()!
		if (child_count) {
			relement += '\n'
			if (stack.length) {
				relement += '  '.repeat(stack.length)
			}
			relement += ']'
		}
		relement += ')'
		if (stack.length) {
			tos_().child_count++
		}
	}
}
if (is_entry_file_(import.meta.url, process.argv[1])) {
	html__relement_(await clipboard.read())
		.then(relement=>clipboard.write(relement))
		.then(()=>process.exit(0))
		.catch(err=>{
			console.error(err)
			process.exit(1)
		})
}

/**
 * Use these utility functions in the developer console.
 * url__update & snippet__update will load the document & start the visualizer.
 * These functions will make the visualizer UI taller & scroll to the top of the visualizer.
 *
 * ```js
 * url__update('https://example.com')
 ?* snippet__update('Your HTML')
 * ```
 */
/** @see {https://issemantic.net/rdf-visualizer} */
function url__update(url) {
	$('[href="#websearch"]').trigger('click')
	document.querySelector('[name=input][value=mixed]').checked = true
	const page_val = document.querySelector('#page-val')
	page_val.value = url
	document.querySelector('#page-btn').dispatchEvent(new MouseEvent('click'))
	setTimeout(()=>{
		sd_svg__full_height()
	}, 1000)
	setTimeout(()=>{
		force__stop()
	}, 5_000)
}
function snippet__update(snippet) {
	$('[href="#snippet"]').trigger('click')
	document.querySelector('[name=input][value=mixed]').checked = true
	const page_val = document.querySelector('#snippet-data')
	page_val.value = snippet
	document.querySelector('#snippet-btn').dispatchEvent(new MouseEvent('click'))
	setTimeout(()=>{
		sd_svg__full_height()
	}, 1000)
	setTimeout(()=>{
		force__stop()
	}, 5_000)
}
function force__stop() {
	force.stop()
}
function sd_svg__full_height() {
	const sd_svg = document.querySelector('#svg-cont')
	const sd_svg_parent = sd_svg.parentElement
	sd_svg_parent.style.height = '100dvh'
	const sd_svg_style = sd_svg.style
	sd_svg_style.height = '100dvh'
	sd_svg_style.maxHeight = '100dvh'
	document.querySelector('#sd-svg').style.height = '100dvh'
	setTimeout(()=>{
		window.scrollTo(0, window.scrollY + sd_svg_parent.getBoundingClientRect().top)
	}, 1000)
}

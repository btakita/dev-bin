/** @see {https://issemantic.net/rdf-visualizer} */
function url__update(url) {
	$('[href="#websearch"]').trigger('click')
	document.querySelector('[name=input][value=mixed]').checked = true
	let page_val = document.querySelector('#page-val')
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
	let page_val = document.querySelector('#snippet-data')
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
	document.querySelector('#svg-cont').parentElement.style.height = '100dvh'
	document.querySelector('#svg-cont').style.height = '100dvh'
	document.querySelector('#svg-cont').style.maxHeight = '100dvh'
	document.querySelector('#sd-svg').style.height = '100dvh'
	setTimeout(()=>{
		window.scrollTo(0, window.scrollY + document.querySelector('#svg-cont').parentElement.getBoundingClientRect().top)
	}, 1000)
}

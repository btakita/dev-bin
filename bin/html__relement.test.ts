import { test } from 'uvu'
import { equal } from 'uvu/assert'
import { html__relement_ } from './html__relement_.js'
test('1 level self-closing tag', async ()=>{
	equal(await html__relement_(`<stop stop-color="#FFF" offset="0%" />`),
		`stop_({ 'stop-color': '#FFF', offset: '0%' })`)
})
test('1 level with text', async ()=>{
	equal(await html__relement_(`<span class="ml-3">Watch the full video (2 min)</span>`),
		`
span_({
  class: class_(
    'ml-3')
  }, [
  'Watch the full video (2 min)'
])
		`.trim())
})
test('2 levels with self-closing tags', async ()=>{
	equal(await html__relement_(`
		<linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="hero-ill-a">
				<stop stop-color="#FFF" offset="0%" />
				<stop stop-color="#EAEAEA" offset="77.402%" />
				<stop stop-color="#DFDFDF" offset="100%" />
		</linearGradient>
	`), `
linearGradient_({ x1: '50%', y1: '0%', x2: '50%', y2: '100%', id: 'hero-ill-a' }, [
  stop_({ 'stop-color': '#FFF', offset: '0%' }),
  stop_({ 'stop-color': '#EAEAEA', offset: '77.402%' }),
  stop_({ 'stop-color': '#DFDFDF', offset: '100%' })
])
	`.trim())
})
test('3 levels', async ()=>{
	equal(await html__relement_(`
		<defs>
				<linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="hero-ill-a">
						<stop stop-color="#FFF" offset="0%" />
						<stop stop-color="#EAEAEA" offset="77.402%" />
						<stop stop-color="#DFDFDF" offset="100%" />
				</linearGradient>
				<linearGradient x1="50%" y1="0%" x2="50%" y2="99.24%" id="hero-ill-b">
						<stop stop-color="#FFF" offset="0%" />
						<stop stop-color="#EAEAEA" offset="48.57%" />
						<stop stop-color="#DFDFDF" stop-opacity="0" offset="100%" />
				</linearGradient>
				<radialGradient cx="21.152%" cy="86.063%" fx="21.152%" fy="86.063%" r="79.941%" id="hero-ill-e">
						<stop stop-color="#4FD1C5" offset="0%" />
						<stop stop-color="#81E6D9" offset="25.871%" />
						<stop stop-color="#338CF5" offset="100%" />
				</radialGradient>
				<circle id="hero-ill-d" cx="384" cy="216" r="64" />
		</defs>
	`), `
defs_([
  linearGradient_({ x1: '50%', y1: '0%', x2: '50%', y2: '100%', id: 'hero-ill-a' }, [
    stop_({ 'stop-color': '#FFF', offset: '0%' }),
    stop_({ 'stop-color': '#EAEAEA', offset: '77.402%' }),
    stop_({ 'stop-color': '#DFDFDF', offset: '100%' })
  ]),
  linearGradient_({ x1: '50%', y1: '0%', x2: '50%', y2: '99.24%', id: 'hero-ill-b' }, [
    stop_({ 'stop-color': '#FFF', offset: '0%' }),
    stop_({ 'stop-color': '#EAEAEA', offset: '48.57%' }),
    stop_({ 'stop-color': '#DFDFDF', 'stop-opacity': '0', offset: '100%' })
  ]),
  radialGradient_({ cx: '21.152%', cy: '86.063%', fx: '21.152%', fy: '86.063%', r: '79.941%', id: 'hero-ill-e' }, [
    stop_({ 'stop-color': '#4FD1C5', offset: '0%' }),
    stop_({ 'stop-color': '#81E6D9', offset: '25.871%' }),
    stop_({ 'stop-color': '#338CF5', offset: '100%' })
  ]),
  circle_({ id: 'hero-ill-d', cx: '384', cy: '216', r: '64' })
])
  `.trim())
})
test('single quote in attribute', async ()=>{
	equal(await html__relement_(`
		<div
				id="modal"
				class="fixed inset-0 z-50 overflow-hidden flex items-center justify-center transform px-4 sm:px-6"
				role="dialog"
				aria-modal="true"
				aria-labelledby="modal-headline"
				x-show="modalExpanded"
				x-transition:enter="transition ease-out duration-200"
				x-transition:enter-start="opacity-0 scale-95"
				x-transition:enter-end="opacity-100 scale-100"
				x-transition:leave="transition ease-out duration-200"
				x-transition:leave-start="opacity-100 scale-100"
				x-transition:leave-end="opacity-0 scale-95"
				x-cloak
		>
				<div class="bg-white overflow-auto max-w-6xl w-full max-h-full" @click.outside="modalExpanded = false" @keydown.escape.window="modalExpanded = false">
						<div class="relative pb-9/16">
								<video x-init="$watch('modalExpanded', value => value ? $el.play() : $el.pause())" class="absolute w-full h-full" width="1920" height="1080" loop controls>
										<source src="./videos/video.mp4" type="video/mp4" />
										Your browser does not support the video tag.
								</video>
						</div>
				</div>
		</div>
	`), `
div_({ id: 'modal',
  class: class_(
    'fixed',
    'inset-0',
    'z-50',
    'overflow-hidden',
    'flex',
    'items-center',
    'justify-center',
    'transform',
    'px-4',
    'sm:px-6'), role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modal-headline', 'x-show': 'modalExpanded', 'x-transition:enter': 'transition ease-out duration-200', 'x-transition:enter-start': 'opacity-0 scale-95', 'x-transition:enter-end': 'opacity-100 scale-100', 'x-transition:leave': 'transition ease-out duration-200', 'x-transition:leave-start': 'opacity-100 scale-100', 'x-transition:leave-end': 'opacity-0 scale-95', 'x-cloak': '' }, [
  div_({
    class: class_(
      'bg-white',
      'overflow-auto',
      'max-w-6xl',
      'w-full',
      'max-h-full'), '@click.outside': 'modalExpanded = false', '@keydown.escape.window': 'modalExpanded = false' }, [
    div_({
      class: class_(
        'relative',
        'pb-9/16')
      }, [
      video_({ 'x-init': '$watch(\\'modalExpanded\\', value => value ? $el.play() : $el.pause())',
        class: class_(
          'absolute',
          'w-full',
          'h-full'), width: '1920', height: '1080', loop: '', controls: '' }, [
        source_({ src: './videos/video.mp4', type: 'video/mp4' }),
        'Your browser does not support the video tag.'
      ])
    ])
  ])
])
	`.trim())
})
test.run()

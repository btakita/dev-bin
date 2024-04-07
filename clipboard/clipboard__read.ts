import { $ } from 'bun'
import clipboard from 'clipboardy'
export async function clipboard__read() {
	let text = await clipboard.read()
	if (!text) {
		const is_wayland = process.env.XDG_SESSION_TYPE === 'wayland'
		if (!is_wayland) {
			throw Error('clipboard not supported')
		}
		text = await $`wl-paste`.text()
	}
	return text
}

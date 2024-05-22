import { spawn } from 'bun'
import clipboard from 'clipboardy'
export async function clipboard__write(text:string) {
	try {
		await clipboard.write(text)
	} catch (_error) {
		const error = <Error>_error
		const is_wayland = process.env.XDG_SESSION_TYPE === 'wayland'
		if (!error.message.includes('Couldn\'t find the `xsel` binary and fallback didn\'t work.') || !is_wayland) {
			throw error
		}
		wl_copy(text)
	}
	if (!await clipboard.read()) {
		wl_copy(text)
	}
}
function wl_copy(text:string) {
	return spawn(['wl-copy', text], { stdio: ['ignore', 'ignore', 'ignore'] })
}

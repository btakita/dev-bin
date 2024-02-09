#!/usr/bin/env bun
import { $ } from 'bun'
const path_a1 = Bun.argv.slice(2)
await Promise.all(path_a1.map(async path=>
	Bun.write(
		path,
		await $`unexpand -t 2 '${path}'`.text())))

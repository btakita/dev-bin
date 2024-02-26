#!/usr/bin/env sh

git fetch && \
git rebase && \
git submodule status | \
awk '{print $2}' | \
xargs -P16 -I{} git -C {} pull --rebase --no-recurse-submodules origin HEAD

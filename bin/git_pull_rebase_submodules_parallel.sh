#!/usr/bin/env sh

 git pull --recurse-submodules -j 16 --rebase && git submodule status | awk '{print $2}' | xargs -P16 -I{} git -C {} pull --rebase origin HEAD

#!/usr/bin/env sh
(cd $1; git add .; git log -n1 | tail -n+3 | sed -En 's/    /  /gp') | xsel -b

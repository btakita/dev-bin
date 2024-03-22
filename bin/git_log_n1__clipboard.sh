#!/usr/bin/env sh
(cd $1; git add .; git log -n1 | tail -n+5 | sed -En 's/ {4}/\t/gp') | xsel -b

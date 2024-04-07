#!/usr/bin/env sh
copy="$([ "$XDG_SESSION_TYPE" = 'wayland' ] && echo 'wl-copy' || echo 'xsel -b')"
(cd $1; git add .; git log -n1) \
 | tail -n+5 \
 | sed -E 's/ {4}/\t/g' \
 | sed -E 's/^\t{3}/\t\t/g' \
 | sed -r '/^\s*$/d' \
 | $copy

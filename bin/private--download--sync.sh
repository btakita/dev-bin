#!/bin/sh
mkdir -p private
aws s3 sync s3://$PRIVATE_AWS_BUCKET/ private "$@"

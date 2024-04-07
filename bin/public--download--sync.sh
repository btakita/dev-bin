#!/bin/sh
mkdir -p public
aws s3 sync s3://$AWS_BUCKET/ public "$@"

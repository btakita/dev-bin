#!/bin/sh
aws s3 sync public s3://$AWS_BUCKET/ "$@"

#!/bin/sh
aws s3 cp public s3://$AWS_BUCKET/ --recursive "$@"

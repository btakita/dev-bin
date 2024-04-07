#!/bin/sh
mkdir -p private
aws s3 cp s3://$PRIVATE_AWS_BUCKET/ private --recursive "$@"

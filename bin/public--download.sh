#!/bin/sh
mkdir -p public
aws s3 cp s3://$AWS_BUCKET/ public --recursive

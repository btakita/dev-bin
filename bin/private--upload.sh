#!/bin/sh
aws s3 cp private s3://$PRIVATE_AWS_BUCKET/ --recursive "$@"

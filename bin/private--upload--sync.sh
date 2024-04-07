#!/bin/sh
aws s3 sync private s3://$PRIVATE_AWS_BUCKET/ "$@"

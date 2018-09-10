#!/bin/bash

BASEDIR=$(cd $(dirname $0) && pwd)
cd $BASEDIR

/usr/bin/python ./svMonCheck.py

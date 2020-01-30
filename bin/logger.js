#!/usr/bin/env node

'use strict';

const server = require('../lib');

const remote = process.argv[2];

server.start(remote);

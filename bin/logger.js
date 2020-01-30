#!/usr/bin/env node

'use strict';

const server = require('../lib');

const remote = process.argv[2];
const logfile = process.argv[3];

server.start(remote, logfile);

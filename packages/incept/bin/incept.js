#!/usr/bin/env node

const config = require('../dist/babel/defaults').default
require('@babel/register')(config);
require('../dist/boot');
  
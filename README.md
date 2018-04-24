[![Build Status](https://travis-ci.org/revington/backoff-time.svg?branch=master)](https://travis-ci.org/revington/backoff-time)
[![Known Vulnerabilities](https://snyk.io/test/github/revington/backoff-time/badge.svg?targetFile=package.json)](https://snyk.io/test/github/revington/backoff-time?targetFile=package.json)
[![Coverage Status](https://coveralls.io/repos/github/revington/backoff-time/badge.svg?branch=master)](https://coveralls.io/github/revington/backoff-time?branch=master)

# backoff-time
Zero deps backoff time function


## Install 
```
$ npm install backoff-time
```

## Usage
```
const minBackoff = 50;
const maxBackoff = 5000;
const backoff = require('backoff-time')(minBackoff, maxBackoff);
var attempt = 0;

function blah(...){
}
// every time blah fails we increment *attempt*
const wait = backoff(attempt);
// retry
setTimeout(fn, wait);
```

## io-videohub

Black Magic Videohub driver for iojs (and node.js), still lacking any significant functionality.

### Installation

```bash
$ npm install io-videohub
```

### Usage

```javascript

var router = require('io-videohub');
var connection = router.connect('192.168.1.1', '9991');


/**
 *  Route output 1 to input 11 (crosspoints are 0 based)
 */

connection.route(0, 10);

```

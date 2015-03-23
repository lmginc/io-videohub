## io-videohub

Black Magic Videohub driver for iojs (and node.js), still lacking full functionality.

### Installation

```bash
$ npm install io-videohub
```

### Idiosyncracies

The nature of the Blackmagic router is such that the state is represented in this driver, as a mirror of the router. The router communicates entirely asynchronously between itself and its clients. As such, when communicating with the router, you cannot ensure the command sent to the router succeeded. That is because the `ACK` or `NAK` responses are not in lock step with commands issued. Though, upon every command sent to the server, you will recieve back a message that updates the state of the driver with this info. Due to this, the state of the driver is represented soley by messages that are delivered from the router, rather than the state being updated by commands issued through the driver. 

### Usage

```javascript

var Router = require('io-videohub');
var router = new Router({host: '192.168.1.1', port: '9991'});

/**
 *  Route output 1 to input 11 (crosspoints are 0 based)
 */

router.route(0, 10);

/**
 *  Receive messages from the router
 *  call the callback upon any update of the router state
 */

router.on('update', callback);

/**
 *  Set an output label
 *
 *  physical connectors on the router are 0 indexed
 *  this will set router output 1 to be called 'Records 1'
 */

router.setOutputLabel(0, 'Records 1');

/**
 *  Set an input label
 *
 *  again, physical connectors on the router are 0 indexed
 *  this will set router input 1 ot be called 'Cam 1'
 */

router.setIntputLabel(0, 'Cam 1');

/**
 *  Intercept errors from the underlying tcp connection
 */

router.connection.on('error', callback);

```

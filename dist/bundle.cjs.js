'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _ = _interopDefault(require('lodash'));
var Promise = _interopDefault(require('bluebird'));
var amqp = _interopDefault(require('amqp'));

function lift() {
  let amqpConfig = _.get(framework, 'config.connections.amqp');

  const connection = amqp.createConnection(amqpConfig);
  connection.on('error', e => {
    framework.log.warn(e);
    process.exit(1);
  });
  return new Promise(resolve => {
    connection.on('ready', () => {
      framework.amqpConnection = connection;
      resolve();
    });
  }).timeout(10000).catch(Promise.TimeoutError, () => {
    framework.log.warn(new Error('mq connect timeout'));
    process.exit(1);
  });
}

module.exports = lift;
//# sourceMappingURL=bundle.cjs.js.map

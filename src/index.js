import _ from 'lodash';
import Promise from 'bluebird';
import amqp from 'amqp';

export default function lift() {
  let amqpConfig = _.get(framework, 'config.connections.amqp');

  const connection = amqp.createConnection(amqpConfig);

  connection.on('error', (e) => {
    framework.log.warn(e);
    process.exit(1);
  });

  return new Promise((resolve) => {
    connection.on('ready', () => {
      framework.amqpConnection = connection;

      resolve();
    });
  })
    .timeout(10000)
    .catch(Promise.TimeoutError, () => {
      framework.log.warn(new Error('mq connect timeout'));
      process.exit(1);
    });
}

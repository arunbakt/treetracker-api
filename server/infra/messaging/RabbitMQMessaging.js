const Broker = require('rascal').BrokerAsPromised;
const config = require('./config').config;

const publishMessage = async (publicationName, payload, resultHandler) => {
  const broker = await Broker.create(config);
  try {
    const publication = await broker.publish(
      publicationName,
      payload,
      'capture-data.creation',
    );
    publication.on('success', resultHandler).on('error', (err, messageId) => {
      console.error(`Error with id ${messageId} ${err.message}`);
      throw err;
    });
  } catch (err) {
    console.error(`Error publishing message ${err}`);
  }
};

// not used currently, but saving for future use
const subscribe = async (subscriptionName, eventHandler) => {
  const broker = await Broker.create(config);
  try {
    const subscription = await broker.subscribe(subscriptionName);
    subscription
      .on('message', (message, content, ackOrNack) => {
        eventHandler(content);
        ackOrNack();
      })
      .on('error', console.error);
  } catch (err) {
    console.error(`Error subscribing to the queue ${queueName}, error: ${err}`);
  }
};

module.exports = { publishMessage, subscribe };

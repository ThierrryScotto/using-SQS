'use strict';

// environment variables
require('dotenv').config();

// sqs
const sqs = require('./services/sqs'); 

module.exports.receiveGrade = async (event, context) => {
  const messages = await sqs.receiveMessage();

  if (!messages) {
    return { statusCode: 404, body: JSON.stringify({ message: "The queue is empty" })};
  }

  // toda a tratativa do sqs no dynamo

  const messageDeleted = await sqs.deleteMessage(messages);

  return { statusCode: 200, body: JSON.stringify(messageDeleted)};
};

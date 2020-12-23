'use strict';

// environment variables
require('dotenv').config();

// dependencies
const AWS = require('aws-sdk');

var sqs = new AWS.SQS({ apiVersion: process.env.AWS_API_VERSION });

const QueueUrl = process.env.AWS_SQS_QUEUE_URL;

module.exports.receiveGrade = async (event, context) => {
  var params = {
    AttributeNames: [
       "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
       "All"
    ],
    QueueUrl: QueueUrl,
    VisibilityTimeout: 1,
    WaitTimeSeconds: 0
  };

  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log("Receive Error", err);
      return { statusCode: 400, body: JSON.stringify({ message: 'Error to get grades' })};
    }

    if (data.Messages) {
      var deleteParams = {
        QueueUrl: QueueUrl,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
  
      sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
          console.log("Delete Error", err);
          return { statusCode: 400, body: JSON.stringify({ message: `Error to delete grade ${data.ResponseMetadata.RequestId}` })};
        } else {
          console.log("Message Deleted", data);
          return { statusCode: 200, body: JSON.stringify({ message: `Grade ${data.ResponseMetadata.RequestId} deleted from the queue` })};
        }
      });
    }
    console.log('Empty queue');
    return { statusCode: 404, body: JSON.stringify({ message: `Empty QUEUE FIFO` })};
  });
};

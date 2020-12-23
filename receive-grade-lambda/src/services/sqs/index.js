'use strict';

// environment variables
require('dotenv').config();

// dependencies
const AWS = require('aws-sdk');

//
//  promisify
const { promisify } = require('util');

class SQSClass {
  constructor() {
    this.sqs      = new AWS.SQS({ apiVersion: process.env.AWS_API_VERSION });
    this.QueueUrl = process.env.AWS_SQS_QUEUE_URL;
  };

  async promiseFunction(nameOfFunction) {
    const newPromiseFunction = await promisify(nameOfFunction).bind(this.sqs);
    return newPromiseFunction;
  };

  async receiveMessage() {
    const receiveMessageAsync = await this.promiseFunction(this.sqs.receiveMessage);
    if (receiveMessageAsync) {

      var params = {
        AttributeNames: [
           "SentTimestamp"
        ],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: [  
          "course",
          "grade",
          "professor",
          "student"
        ],
        QueueUrl: this.QueueUrl,
        VisibilityTimeout: 5,
        WaitTimeSeconds: 15
      };

      const result = await receiveMessageAsync(params);
      return result.Messages || false;
    }
  }

  async deleteMessage(messages) {
    const deleteMessageSsync = await this.promiseFunction(this.sqs.deleteMessage);
    let idMessageDeleted     = [];

    if (deleteMessageSsync) {
      for (let index in messages) {
        var deleteParams = {
          QueueUrl      : this.QueueUrl,
          ReceiptHandle : messages[index].ReceiptHandle
        };

        const result = await deleteMessageSsync(deleteParams);
        idMessageDeleted.push(result.ResponseMetadata.RequestId);
      }

      return idMessageDeleted;
    }
  }
}

module.exports = new SQSClass();
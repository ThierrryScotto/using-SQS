'use strict';

// environment variables
require('dotenv').config();

// dependencies
const AWS = require('aws-sdk');

var sqs = new AWS.SQS({ apiVersion: process.env.AWS_API_VERSION });

module.exports.sendGrade = async (event, context) => {
  const { professorId, studentId, courseId } = event.pathParameters;
  const body = event.body;

  let params = {
   MessageAttributes: {
     "professor": {
        DataType: "String",
        StringValue: professorId,
     },
     "student": {
        DataType: "String",
        StringValue: studentId,
     },
     "course": {
        DataType: "String",
        StringValue: courseId,
     },
     "grade": {
        DataType: "String",
        StringValue: String(body.grade)
     }
    },
    MessageBody: `send grade to QUEUE FIFO.`,
    MessageDeduplicationId: "TheWhistler",
    MessageGroupId: process.env.AWS_SQS_MESSAGE_GGROUP_ID,
    QueueUrl: process.env.AWS_SQS_QUEUE_URL
  };

  return await sqs.sendMessage(params, function(err, data) {
    if (err) {
      console.log("Error", err);
      return { statusCode: 400, body: JSON.stringify({ message: `The grade not send to QUEUE FIFO. ${err}` })};
    } 

    return { statusCode: 200, body: JSON.stringify({ message: "Grade send to QUEUE FIFO." })};
  }).promise();
};

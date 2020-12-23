'use strict';

// environment variables
require('dotenv').config();

// dependencies
const AWS = require('aws-sdk');

// models 
const Grades = require('./models/grades');

var sqs = new AWS.SQS({ apiVersion: process.env.AWS_API_VERSION });

const QueueUrl = process.env.AWS_SQS_QUEUE_URL;

module.exports.receiveGrade = async (event, context) => {
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
    QueueUrl: QueueUrl,
    VisibilityTimeout: 5,
    WaitTimeSeconds: 15
  };

  sqs.receiveMessage(params, async function(err, data) {
    if (err) {
      console.log("Receive Error", err);
    }

    if (data.Messages) {
      const { course, student, professor, grade } =  data.Messages[0].MessageAttributes;

      const gradeCreated = await Grades.create({ 
        ProfessorId : professor.StringValue,
        courseId    : course.StringValue,
        studentId   : student.StringValue,
        grade       : grade.StringValue || 0
       });

      if (gradeCreated) {
        var deleteParams = {
          QueueUrl: QueueUrl,
          ReceiptHandle: data.Messages[0].ReceiptHandle
        };
    
        sqs.deleteMessage(deleteParams, function(err, data) {
          if (err) {
            console.log("Delete Error", err);
          } else {
            console.log("Message Deleted", data);
          }
        });
      }
    }
    console.log('Empty queue');
    return { statusCode: 200 }
  });
};

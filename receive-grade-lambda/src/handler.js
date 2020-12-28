'use strict';

// environment variables
require('dotenv').config();

// sqs
const sqs = require('./services/sqs'); 

// models
const Grades = require('./models/grades');

module.exports.receiveGrade = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const messages = await sqs.receiveMessage();

  if (!messages) {
    return { statusCode: 404, body: JSON.stringify({ message: "The queue is empty" })};
  }

  for await(let message of messages) {
    await Grades.create({
      ProfessorId : message.MessageAttributes.professor.StringValue,
      courseId    : message.MessageAttributes.course.StringValue,
      studentId   : message.MessageAttributes.student.StringValue,
      grade       : message.MessageAttributes.grade.StringValue
    });
  }
  
  const messageDeleted = await sqs.deleteMessage(messages);

  return { statusCode: 200, body: JSON.stringify(messageDeleted)};
};
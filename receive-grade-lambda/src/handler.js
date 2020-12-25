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

  for (let index in messages) {
    await Grades.create({
      ProfessorId : messages[index].MessageAttributes.professor.StringValue,
      courseId    : messages[index].MessageAttributes.course.StringValue,
      studentId   : messages[index].MessageAttributes.student.StringValue,
      grade       : messages[index].MessageAttributes.grade.StringValue
    });
  }

  const messageDeleted = await sqs.deleteMessage(messages);

  return { statusCode: 200, body: JSON.stringify(messageDeleted)};
};
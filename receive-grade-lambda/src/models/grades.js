'use strict';

// imports
const mongoose  = require('../services/db/index');

const Schema = mongoose.Schema;

const grades = new Schema({
  ProfessorId: { type: String, required: true },
  courseId:    { type: String, required: true },
  studentId:   { type: String, required: true },
  grade:       { type: String, required: true },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grades', grades);

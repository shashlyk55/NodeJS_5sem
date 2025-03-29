const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  faculty: { 
    type: String, 
    unique: true,
    required: true 
  },
  faculty_name: { 
    type: String, 
    required: true 
  },
});

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;

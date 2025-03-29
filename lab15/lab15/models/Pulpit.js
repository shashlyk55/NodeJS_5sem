const mongoose = require("mongoose");

const pulpitSchema = new mongoose.Schema({
  pulpit: { 
    type: String, 
    unique: true,
    required: true 
  },
  pulpit_name: { 
    type: String, 
    required: true 
  },
  faculty: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
});

const Pulpit = mongoose.model("Pulpit", pulpitSchema);

module.exports = Pulpit;

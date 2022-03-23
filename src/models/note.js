const mongoose = require('mongoose')    

const NoteSchema = mongoose.Schema({
  content : {
    type : String,
    required: true,
  },
  author : {
    type : String,
    required: true,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model('Note' , NoteSchema)

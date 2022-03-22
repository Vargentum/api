const mongoose = require('mongoose')    
const noteSchema = mongoose.Schema({
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
module.exports =  mongoose.model('Note' , noteSchema)
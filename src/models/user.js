const mongoose = require('mongoose')    
const Note = require('./note')

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true },
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: { unique: true },
  },
  password: {
    type: String,
    required: true,
  },
  // notes: {
  //   type: [Note],
  //   required: true,
  // },
}, {
  timestamps: true,
})
module.exports =  mongoose.model( 'User' , UserSchema)

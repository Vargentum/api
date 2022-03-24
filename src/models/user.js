const mongoose = require('mongoose')    
const Note = require('./note')

const UserSchema = mongoose.Schema({
  username: {
    type: String,
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
  notes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    }],
    default: [],
  },
  favorites: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    }],
    default: [],
  },
}, {
  timestamps: true,
})
module.exports =  mongoose.model( 'User' , UserSchema)

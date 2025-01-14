const mongoose = require('mongoose')    
const { User } = require('.')

const NoteSchema = mongoose.Schema({
  content : {
    type: String,
    required: true,
  },
  author : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  favoriteCount: {
    type: Number,
    default: 0,
  },
  favoritedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
}, {
  timestamps: true,
})

module.exports = mongoose.model('Note' , NoteSchema)

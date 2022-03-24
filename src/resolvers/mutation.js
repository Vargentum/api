const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { AuthenticationError, ForbiddenError } = require('apollo-server-express')
const gravatar = require('../util/gravatar')
const mongoose = require('mongoose');
require('dotenv').config()


module.exports = {
  newNote: async (parent, {content}, {models, user}) => {
    if (!user) {
      throw new AuthenticationError('Authorize to create notes!')
    }
    console.log(user)
    return await models.Note.create({
      content,
      author: mongoose.Types.ObjectId(user.id),
    })
  },
  updateNote: async (parent, {id, content, author}, {models, user}) => {
    if (!user) {
      throw new AuthenticationError('Authorize to update notes!')
    }
    const note =  await models.Note.findById(id)

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to update the note!")
    }
    return await models.Note.findByIdAndUpdate(
      id,
      {$set: {content}},
      {new: true},
    )
  },
  deleteNote: async (parent, {id}, {models, user}) => {
    if (!user) {
      throw new AuthenticationError('Authorize to delete notes!')
    }
    const note =  await models.Note.findById(id)
    
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to delete the note!")
    }

    try {
      await models.Note.findByIdAndRemove(id)
      return true
    } catch (e) {
      return false
    }
  },
  toggleFavorite: async (parent, {id}, {models, user}) => {
    if (!user) {
      throw new AuthenticationError()
    }
    const note = await models.Note.findById(id)
    const inFavorites = note.favoritedBy.indexOf(user.id) !== -1

    if (inFavorites) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {favoritedBy: mongoose.Types.ObjectId(user.id)},
          $inc: {favoriteCount: -1},
        },
        {new: true},
      )  
    } else {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {favoritedBy: mongoose.Types.ObjectId(user.id)},
          $inc: {favoriteCount: 1},
        },
        {new: true},
      )
    }
  },
  signUp: async (parent, {username, email, password}, {models}) => {
    const hashed = await bcrypt.hash(password, 10)
    const avatar = gravatar(email)

    try {
      const user = await models.User.create({
        email: email.trim().toLowerCase(),
        avatar: username.trim(),
        password: hashed,
        username,
      })

      return jwt.sign({id: user._id}, process.env.JWT_SECRET)
    } catch(err) {
      console.log(err)
      throw new Error('Error creating account')
    }
  },
  signIn: async (parent, {username = '', email = '', password}, {models}) => {
    email = email.trim().toLowerCase()
    username = username.trim()

    const user = await models.User.findOne({
      $or: [ {username}, {email}, ]
    }, 'password')

    if (!user) {
      throw new AuthenticationError('Error signing in')
    }
    
    const isPasswordsMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordsMatch) {
      throw new AuthenticationError('Error signing in')
    }
    
    return jwt.sign({id: user._id}, process.env.JWT_SECRET)
  },
}
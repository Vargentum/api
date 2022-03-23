const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { AuthenticationError, ForbiddenError } = require('apollo-server-express')
const gravatar = require('../util/gravatar')
require('dotenv')


module.exports = {
  newNote: async (parent, {content}, {models}) => 
    await models.Note.create({
      content,
      author: 'Adam Scott',
    })
  ,
  updateNote: async (parent, {id, content}, {models}) => 
    await models.Note.findOneAndUpdate(
      {_id: {$eq: id}}, 
      {$set: {content}},
      {new: true},
    )
  ,
  deleteNote: async (parent, {id}, {models}) => {
    try {
      await models.Note.findOneAndDelete({
        _id: {$eq: id}
      })
      return true
    } catch (e) {
      return false
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
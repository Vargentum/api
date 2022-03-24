const { AuthenticationError } = require("apollo-server-express")

module.exports = {
  notes: async (parent, args, {models}) => 
    await models.Note.find({})
  ,
  note: async (parent, {id}, {models}) => 
    await models.Note.findById(id)
  ,
  favoriteNotes: async (parent, {id}, {models, user}) => {
    if (!user) {
      throw new AuthenticationError('You need to sign in first!')
    }
    const {notes} = await models.User.findById(user.id, 'notes')
    return user.notes
  },
  user: async (parent, {username}, {models}) => 
    await models.User.findOne({username})
  , 
  users: async (parent, args, {models}) => 
    await models.User.find({})
  ,
  me: async (parent, args, {models, user}) => {
    if (!user) {
      throw new AuthenticationError('You need to sign in first!')
    }
    return await models.User.findById(user.id)
  },
}
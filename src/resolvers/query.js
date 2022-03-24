const { AuthenticationError } = require("apollo-server-express")

const MAX_NOTES_TO_RETURN = 100
const NOTE_FEED_LIMIT = 10

module.exports = {
  notes: async (parent, args, {models}) => 
    await models.Note.find({}).limit(MAX_NOTES_TO_RETURN)
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
  noteFeed: async (parent, {cursor}, {models}) => {
    let hasNextPage = false
    let cursorQuery = {}

    if (cursor) {
      cursorQuery = {_id: {$lt: cursor}}
    }

    let notes = await models.Note
      .find(cursorQuery)
      .sort({_id: -1})
      .limit(NOTE_FEED_LIMIT + 1)

    if (notes.length > NOTE_FEED_LIMIT) {
      hasNextPage = true
      notes = notes.slice(0, -1)
    }

    let nextCursor = notes[notes.length - 1]._id

    return {
      notes,
      hasNextPage,
      cursor: nextCursor,
    }
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
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
}
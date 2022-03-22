module.exports = {
  newNote: async (parent, {content}, {models}) => 
    await models.Note.create({
      content,
      author: 'Adam Scott',
    })
}
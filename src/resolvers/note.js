module.exports = {
  author: async (note, args, {models}) => {
    const a = await models.User.findById(note.author)
    console.log(note.author);
    console.log(a);
    return a
  },
  favoritedBy: async (note, args, {models}) =>
    await models.User.find({_id: {$in: note.favoritedBy}})
  ,
}
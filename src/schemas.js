const {gql} = require('apollo-server-express')

module.exports = gql`
  scalar DateTime
  type Query {
    notes: [Note!]!,
    note(id: ID!): Note!,
    user(username: String!): User,
    users: [User!]!,
    me: User!,
    favoriteNotes: [Note!],
    noteFeed (cursor: String): NoteFeed,
  }
  type Mutation {
    newNote(content: String!): Note!,
    updateNote(id: ID!, content: String!): Note!,
    deleteNote(id: ID!): Boolean!,
    toggleFavorite(id: ID!): Note!,
    signUp(username: String!, email: String!, password: String!): String!,
    signIn(username: String, email: String, password: String!): String!,
  }
  type Note {
    id: ID!,
    content: String!,
    author: User!,
    createdAt: DateTime!,
    updatedAt: DateTime!,
    favoriteCount: Int!,
    favoritedBy: [User!],
  }
  type NoteFeed {
    notes: [Note]!,
    hasNextPage: Boolean!,
    cursor: String!,
  }
  type User {
    id: ID!,
    username: String,
    avatar: String,
    email: String,
    notes: [Note!],
    favorites: [Note!],
  }
`
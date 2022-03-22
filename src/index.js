require('dotenv').config()
const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const db = require('./db')
const models = require('./models')

const port = process.env.PORT || 4000
const DB_HOST = process.env.DB_HOST

const typeDefs = gql`
  type Query {
    hello: String!
    notes: [Note!]!,
    note(id: ID!): Note!,
  }
  type Mutation {
    newNote(content: String!): Note!,
  }
  type Note {
    id: ID!,
    content: String!,
    author: String!,
  }
`

const resolvers = {
  Query: {
    hello: () => "Hello world",
    notes: async () => await models.Note.find(),
    note: async (parent, {id}) => await models.Note.findById(id)
  },
  Mutation: {
    newNote: async (parent, {content}) => 
      await models.Note.create({
        content,
        author: 'Adam Scott',
      })
  }
}

const app = express()

db.connect(DB_HOST)

const server = new ApolloServer({typeDefs, resolvers})

server.applyMiddleware({app, path: '/api'})

app.listen({ port }, () =>
    console.log(
      `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
)
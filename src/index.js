require('dotenv').config()
const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const db = require('./db')
const typeDefs = require('./schemas')
const resolvers = require('./resolvers')
const models = require('./models')
const jwt = require('jsonwebtoken')
const helmet = require('helmet')
const cors = require('cors')
const depthLimit = require('graphql-depth-limit')
const {createComplexityLimitRule} = require('graphql-validation-complexity')

const port = process.env.PORT || 4000
const DB_HOST = process.env.DB_HOST

const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
      throw new Error('session invalid')
    }
  }
}

const app = express()
app.use(helmet())
app.use(cors())

db.connect(DB_HOST)

const server = new ApolloServer({
  typeDefs, 
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(100)],
  context: ({req}) => {
    const token = req.headers.authorization
    const user = getUser(token)
    return { models, user }
  }
})
server.applyMiddleware({app, path: '/api'})

app.listen({ port }, () =>
    console.log(
      `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
)
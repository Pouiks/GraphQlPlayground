const { GraphQLServer, PubSub } = require('graphql-yoga')
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'
import User from './resolvers/User'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'



// Resolvers

 
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    db,
    PubSub
  }
})
 
server.start(() => {
  console.log('Server is now up and running at http://localhost:4000')
})
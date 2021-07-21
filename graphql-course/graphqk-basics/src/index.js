const { GraphQLServer } = require('graphql-yoga')
 
// Type Definitions
const typeDefs = `
  type Query {
    greeting(name: String, position:String): String!
    me: User!
    post: Post!
    additionnal(x: Float!, y: Float!): Float!
  }

  type User {
      id: ID!
      name: String!
      email : String!
      age: Int
  }
  type Post{
      id: ID!
      title: String!
      body: String!
      published: Boolean!
  }
`
 
// Resolvers
const resolvers = {
  Query: {
    additionnal: (parent, args, ctx, info) => {
      if(args.x && args.y) {
        return args.x + args.y
      } else {
        return 0
      }
    },
    greeting: (parent, args, ctx,info) => {
      if(args.name && args.position){
        return `Hello ${args.name}! You are my favorite ${args.position}`
      } else {
        return 'Hello !'
      }
    },
    me: () => {
        return {
            id: '123098',
            name: 'Mike',
            email: 'mike@exemple.com',
            age: 29
        }
    },
    post:() => {
        return {
            id: 'p0233',
            title: 'Je suis le titre du post',
            body:'lorem ipsum dolor sit amet, consectet',
            published: true

        }
    }
  },
}
 
const server = new GraphQLServer({
  typeDefs,
  resolvers,
})
 
server.start(() => {
  console.log('Server is now up and running at http://localhost:4000')
})
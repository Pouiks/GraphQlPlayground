const { GraphQLServer } = require('graphql-yoga')
 
// Demo user data

const users = [{
  id: '1',
  name: 'Virgile',
  email: 'virgile@example.com',
  age: 30
}, {
  id: '2',
  name: 'Bruno',
  email: 'bruno@example.com'
}, {
  id:'3',
  name: 'Yann',
  email: 'yann@example.com',
  age: 31
}]

const posts = [{
  id: '1',
  title: 'Découverte de graphQl',
  body: 'lorem ipsum dolor sit amet, consectet',
  published: false
}, {
  id: '2',
  title: 'la phase caché de postgresQL',
  body: 'lorem ipsum dolor sit amet, consectet',
  published: true
},{
  id: '3',
  title: 'Signature d\'un cdi dans ma boite',
  body: 'lorem ipsum dolor sit amet, consectet',
  published: false
}]

// Type Definitions
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
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
    posts: (parent, args, ctx, info) => {
      if(!args.query){
        return posts
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title.toLocaleLowerCase().includes(args.query.toLowerCase())
        const isBodyMatch = post.body.toLocaleLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch || isBodyMatch

      })
    },
    users: (parent, args, ctx, info) => {
      if(!args.query){
        return users
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
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
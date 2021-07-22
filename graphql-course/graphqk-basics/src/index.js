const { GraphQLServer } = require('graphql-yoga')
const { v4: uuidv4 } = require('uuid'); 
// Demo user data
const comments = [{
  id: '1',
  text: 'Awesome article, i read it many times',
  author: '1',
  post: '1'
}, {
  id : '2',
  text: 'Not the best article ever read, but it\s ok ',
  author: '2',
  post: '2'
}, {
  id : '3',
  text: 'I definetly prefer front end',
  author:'3',
  post: '3'
}, {
  id: '4',
  text: 'hope you will give to us other article like this ',
  author: '3',
  post: '1'
}]

const users = [{
  id: '1',
  name: 'Virgile',
  email: 'virgile@example.com',
  age: 30,
}, {
  id: '2',
  name: 'Bruno',
  email: 'bruno@example.com',
}, {
  id:'3',
  name: 'Yann',
  email: 'yann@example.com',
  age: 31,
}]

const posts = [{
  id: '1',
  title: 'Découverte de graphQl',
  body: 'lorem ipsum dolor sit amet, consectet',
  published: false,
  author: '1'
}, {
  id: '2',
  title: 'la phase caché de postgresQL',
  body: 'lorem ipsum dolor sit amet, consectet',
  published: true,
  author: '1'
},{
  id: '3',
  title: 'Signature d\'un cdi dans ma boite',
  body: 'lorem ipsum dolor sit amet, consectet',
  published: false,
  author: '3'
}]

// Type Definitions
const typeDefs = `
  type Query {
    comments(query: String): [Comment!]!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }

  type User {
    id: ID!
    name: String!
    email : String!
    age: Int
    posts: [Post!]!
    comments: [Comment]!
  }
  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment]!
  }
  type Comment{
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`
 
// Resolvers
const resolvers = {
  Query: {
    comments: (parent, args, ctx, info) => {
      // return comments
      if(!args.query){
        return comments
      }
      return comments.filter((comment) => {
        const isTextMatch = comment.text.toLowerCase().includes(args.query.toLowerCase())
        return isTextMatch
      })
    },
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
  Mutation: {
    createUser: (parent, args, ctx, info) =>  {
      const emailTaken = users.some((user)=>user.email === args.email)
      if(emailTaken){
        throw new Error('Email already exist')
      }

      const user = {
        id: uuidv4(),
        ...args
      }
      users.push(user)

      return user
    },
    createPost(parent, args, ctx, info){
      const userExist = users.some((user) => user.id === args.author)
      const postExist = posts.some((post) => post.title === args.title )
      if(!userExist){
        throw new Error('This user doesn\'t exist')
      }else if(postExist){
        throw new Error('Title is taken by another post')
      }

      const post = {
        id: uuidv4(),
        ...args
      }

      posts.push(post)

      return post 
    },
    createComment(parent, args, ctx, info){
      const userExist = users.some((user) => user.id === args.author)
      const postExist = posts.some((post) => {
        return post.id === args.post && post.published
      })
      if(!userExist){
        throw new Error('This user doesn\'t exist')
      }else if(!postExist){
        throw new Error('This post doesn\'t exist')
      }

      const comment = {
        id: uuidv4(),
        ...args
      }
      comments.push(comment)

      return comment
    }

  },
  Post: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    comments: (parent, args, ctx, info) => {
      return comments.filter((comment) => {
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts(parent, args, ctx, info){
      return posts.filter((post) => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info){
      return comments.filter((comment)=> {
        return comment.author === parent.id
      })
    }
  },
  Comment: {
    author: (parent, args, ctx, info) => {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    post: (parent, args, ctx, info) => {
      return posts.find((post) => {
        return post.id === parent.id
      })
    }
  }
}
 
const server = new GraphQLServer({
  typeDefs,
  resolvers,
})
 
server.start(() => {
  console.log('Server is now up and running at http://localhost:4000')
})
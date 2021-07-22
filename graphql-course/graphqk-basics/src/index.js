const { GraphQLServer } = require('graphql-yoga')
const { v4: uuidv4 } = require('uuid'); 
// Demo user data
let comments = [{
  id: '1',
  text: 'Awesome article, i read it many times',
  author: '1',
  post: '1'
}, {
  id : '2',
  text: 'Not the best article ever read, but its ok ',
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

let users = [{
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

let posts = [{
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
  title: 'Signature dun cdi dans ma boite',
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
    createUser(data: CreateUserInput!): User!
    deleteUser(id:ID!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id:ID!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int!
  }

  input CreateCommentInput{
    text: String!
    author: ID!
    post: ID!
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
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
      const emailTaken = users.some((user)=> user.email === args.data.email)
      if(emailTaken){
        throw new Error('Email already exist')
      }

      const user = {
        id: uuidv4(),
        ...args.data
      }
      users.push(user)

      return user
    },
    deleteUser: (parent, args, ctx, info) => {
      // Je recupere l'index du User
      const userIndex = users.findInex((user)=> user.id === args.id)
      // si l'index du user n'existe pas, je return une erreur
      if(userIndex === -1){
        throw new Error('This user doesn\'t exist')
      }
      // je supprime dans le tableau l'index de userIndex, 1 valeur
      const deletedUser = users.splice(userIndex, 1)
      // Je vais chercher dans les posts
      // si l'auteur match avec avec l'id des auteurs d'article
      // je supprime les commentaires qui ont l'id du post en cours
      posts = posts.filter((post) => {
        const match = post.author === args.id
          if(match){
            comments = comments.filter((comment) => comment.post === args.post)
          }
        return !match
      })
      comments = comments.filter((comment) => comment.post === args.id)
      return deletedUser[0]
      
    },
    createPost(parent, args, ctx, info){
      const userExist = users.some((user) => user.id === args.data.author)
      const postExist = posts.some((post) => post.title === args.data.title)
      if(!userExist){
        throw new Error('This user doesnt exist')
      }else if(postExist){
        throw new Error('Title is taken by another post')
      }

      const post = {
        id: uuidv4(),
        ...args.data
      }

      posts.push(post)

      return post 
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id)
      if(postIndex === -1){
        throw new Error( "This post do not exist")
      }
      const deletedPost = posts.splice(postIndex, 1)
      
      comments = comments.filter((comment) =>  comment.post === args.id )

      return deletedPost[0]
    },
    createComment(parent, args, ctx, info){
      const userExist = users.some((user) => user.id === args.data.author)
      const postExist = posts.some((post) => {
        return post.id === args.data.post && post.published
      })
      if(!userExist){
        throw new Error('This user doesnt exist')
      }else if(!postExist){
        throw new Error('This post doesnt exist')
      }

      const comment = {
        id: uuidv4(),
        ...args.data
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
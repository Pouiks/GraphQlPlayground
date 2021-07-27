const { v4: uuidv4 } = require('uuid'); 


const Mutation  = {
    createUser: (parent, args, { db }, info) =>  {
        const emailTaken = db.users.some((user)=> user.email === args.data.email)
        if(emailTaken){
          throw new Error('Email already exist')
        }
  
        const user = {
          id: uuidv4(),
          ...args.data
        }
        db.users.push(user)
  
        return user
      },
      updateUser:(parent, args, { db }, info) => {
        const { id , data } = args
        const user = db.users.find((user) => user.id === args.id)
        if(!user){
          throw new Error('user not found')
        }
        if(typeof data.email === 'string'){
          const emailTaken = db.users.some((user) => user.email === data.email)
            if(emailTaken){
              throw new Error('Email taken')
            }
          user.email = data.email
        }
        if(typeof data.name === 'string'){
          user.name = data.name
        }
        if(typeof data.age !== 'undefined'){
          user.age = data.age
        }
        return user
      },
      deleteUser: (parent, args, { db }, info) => {
        // Je recupere l'index du User
        const userIndex = db.users.findInex((user)=> user.id === args.id)
        // si l'index du user n'existe pas, je return une erreur
        if(userIndex === -1){
          throw new Error('This user doesn\'t exist')
        }
        // je supprime dans le tableau l'index de userIndex, 1 valeur
        const deletedUser = db.users.splice(userIndex, 1)
        // Je vais chercher dans les posts
        // si l'auteur match avec avec l'id des auteurs d'article
        // je supprime les commentaires qui ont l'id du post en cours
        posts = db.posts.filter((post) => {
          const match = post.author === args.id
            if(match){
              comments = db.comments.filter((comment) => comment.post === args.post)
            }
          return !match
        })
        comments = db.comments.filter((comment) => comment.post === args.id)
        return deletedUser[0]
        
      },
      createPost(parent, args, { db }, info){
        const userExist = db.users.some((user) => user.id === args.data.author)
        const postExist = db.posts.some((post) => post.title === args.data.title)
        if(!userExist){
          throw new Error('This user doesnt exist')
        }else if(postExist){
          throw new Error('Title is taken by another post')
        }
  
        const post = {
          id: uuidv4(),
          ...args.data
        }
  
        db.posts.push(post)
  
        return post 
      },
      updatePost(parent, args, { db }, info){
        const {id, data } = args
        const post = db.posts.find((post) => post.id === id)
        if(!post){
          throw new Error('post not found')
        }
        if(typeof data.title === 'string'){
          post.title = data.title
        }
        if(typeof data.body === 'string'){
          post.body = data.body
        }
        if(typeof data.published === 'boolean'){
          post.published = data.published
        }
        return post
      },
      deletePost(parent, args, { db }, info) {
        const postIndex = db.posts.findIndex((post) => post.id === args.id)
        if(postIndex === -1){
          throw new Error( "This post do not exist")
        }
        const deletedPost = db.posts.splice(postIndex, 1)
        
        comments = db.comments.filter((comment) =>  comment.post === args.id )
  
        return deletedPost[0]
      },
      createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published)

        if (!userExists || !postExists) {
            throw new Error('Unable to find user and post')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment)
        pubsub.publish(`comment ${args.data.post}`, { comment })

        return comment
    },
      deleteComment(parent, args, { db }, info){
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
        if(commentIndex === -1){
          throw new Error('Comment not found')
        }
        const deletedComment = db.comments.splice(commentIndex, 1)
        comments = db.comments.filter((comment) => comment.id === args.id)
        return deletedComment[0]
      },
      updateComment(parent, args, { db }, info){
        const {id, data} = args
        const comment = db.comments.find((comment) => comment.id === id)
        if(!comment){
          throw new Error('Comment not found')
        }
        if(typeof data.text === 'string'){
          comment.text = data.text
        }
        return comment
      }
  
}
export { Mutation as default}
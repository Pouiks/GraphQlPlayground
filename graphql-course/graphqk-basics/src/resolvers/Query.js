const Query = {
    comments: (parent, args, { db }, info) => {
        // return comments
        if(!args.query){
          return db.comments
        }
        return comments.filter((comment) => {
          const isTextMatch = comment.text.toLowerCase().includes(args.query.toLowerCase())
          return isTextMatch
        })
      },
      posts: (parent, args, { db }, info) => {
        if(!args.query){
          return db.posts
        }
  
        return db.posts.filter((post) => {
          const isTitleMatch = post.title.toLocaleLowerCase().includes(args.query.toLowerCase())
          const isBodyMatch = post.body.toLocaleLowerCase().includes(args.query.toLowerCase())
          return isTitleMatch || isBodyMatch
  
        })
      },
      users: (parent, args, { db }, info) => {
        if(!args.query){
          return db.users
        }
        return db.users.filter((user) => {
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
}

export { Query as default }
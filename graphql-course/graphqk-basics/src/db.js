const comments = [{
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
    title: 'Signature dun cdi dans ma boite',
    body: 'lorem ipsum dolor sit amet, consectet',
    published: false,
    author: '3'
  }]

  const db = { users, comments, posts}
  export default db
const express = require('express')
const session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session)
const app = express()
const port = 3000

const dbURI = 'mongodb+srv://Nickjr:47313@cluster0.wivn8.mongodb.net/blog-site?retryWrites=true&w=majority'

// middlewares
const morgan = require('morgan')
app.use(express.urlencoded({extended:false}));



const mongoose = require('mongoose');
const Blog = require('./models/blog')
const User = require('./models/user')
const { render } = require('ejs')

const bcrypt = require('bcrypt');
const user = require('./models/user')





app.set('view engine', 'ejs')

app.use(morgan('dev'))
app.use(express.static('static'))
var store = new MongoDBStore({
  uri: dbURI,
  collection: 'mySessions'
});
app.use(session({

  // It holds the secret key for session
  secret: 'Your_Secret_Key',

  // Forces the session to be saved
  // back to the session store
  resave: false,

  // Forces a session that is "uninitialized"
  // to be saved to the store
  saveUninitialized: false,
  store: store
})) 



main().then(res => {
  console.log('success')
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  }) 
}).catch(err => console.log('eerror', err));

async function main() {
  const connection = await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
}

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next()
  } else {
    res.redirect('/login')
  }
}


app.get('/', isAuth, (req, res) => {
  Blog.find()
    .then(blogs => {
      console.log(req.session.id)
      res.render('index', {title: 'Home Page', blogs: blogs})
    })
    .catch(err => console.log(err))
})
app.get('/about', (req, res) => {
  res.render('about')
})
app.get('/create-blogs', (req, res) => {
  res.render('create-blog', {title: 'Create Blog'})
})
app.post('/blogs', (req, res) => {
  console.log(req.body)
  const blog = new Blog(req.body)
  blog.save()
  .then(result => {
    res.redirect('/')
  })
  .catch(err => console.log(err))
})

app.get('/blogs/:id', (req, res) => {
  Blog.findByIdAndDelete(req.params.id)
    .then(result => {
      res.render('delete-blog', {title: 'Blog details', blog: result})
    }).catch(err => console.log(err))
})
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndDelete(req.params.id)
    .then(result => {
      res.json({message: 'Blog deleted', redirect: '/'})
    }).catch(err => console.log(err))
})
app.get('/register', (req, res) => {
  res.render('register', {title: 'Register'})
})
app.post('/register', (req, res) => {
  let {firstName, lastName, email, password} = req.body
  bcrypt.genSalt()
  .then(salt => bcrypt.hash(password, salt))
  .then(hash => {
    password = hash; 
    const user = new User({firstName, lastName, email, password})
    user.save()
    .then(result => {console.log('user saved'); res.redirect('/')})
    .catch(err => {console.log('user failed', err); res.redirect('/register')})
})
  .catch(err => console.log('password encryption failed', err))
 

})
app.get('/login', (req, res) => {
  res.render('login', {title: 'Login'})
})
app.post('/login', (req, res) => {
  const {email, password} = req.body
  User.findOne({email})
  .then(user => {
    if(user) {
      bcrypt.compare(password, user.password)
        .then(result => {
          if(result) {
            req.session.isAuth = true
            res.redirect('/')
          } else {
            res.redirect('/login')
          }
        })
      } else {
      res.redirect('/login')
    }
  })
  .catch(err => console.log(err))
})

app.use((req, res) => {
  res.status(404).send('<p>404 Page</p>')
})

// const marked = require('marked');
// or const { marked } = require('marked');

// const html = marked.parse('## Marked in Node.js\n\nRendered by **marked**. \n\n- i am mad');
// console.log(html);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)})\
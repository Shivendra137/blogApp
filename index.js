
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const  router = require('./routes/user');
const  router2 = require('./routes/blog');
const mongoose= require('mongoose');
const cookieparser = require('cookie-parser');  
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const Blog = require('./models/blog')

const PORT = process.env.PORT ||  8000;
// const PORT = 8000;

// mongoose.connect('mongodb://localhost:27017/blogify').then
mongoose.connect(process.env.MONGO_URL).then
(() => console.log( 'mongodb is connected'))

app.use(express.urlencoded ({extended: false}));
app.use(cookieparser());
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))  // public ke pura path dena  padega
/// is middleware se hamne express ko btaya ki public koi route nhi h tum isko statically serve ker sakte ho


app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))


app.get('/', async (req, res)  => {

    const allblogs = await Blog.find({})
    res.render('home',{
        user: req.user,
        blogs: allblogs,
    });
    
})

app.use('/user' , router); ///agar koi bhi request /user se start hoti h toh uske liye router ko use kro 
app.use('/blog', router2);
app.listen(PORT, () => console.log('server started'));
const { Router } = require('express');
const multer = require('multer');
const router2 = Router();
const path =require('path')
const Blog = require('../models/blog')
const Comment  = require('../models/comment')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
       
        const fileName = `${Date.now()}- ${file.originalname}`
        cb(null , fileName);
    }
  })
  const upload = multer({ storage: storage })

router2.get('/add-new' , (req,res) => {

    return res.render('addblog', { 
        user: req.user,
    })
})


router2.post('/', upload.single('coverImage'), async(req,res) => {

    // const Body = req.body;
    // console.log(Body);
    // console.log(req.file);

    const {title, body } = req.body;

  const blog = await Blog.create({

          title,
          body,
          createdBy: req.user._id,
          coverImageURL: `/uploads/${req.file.filename}`

    })

    return res.redirect(`/blog/${blog._id}`)


}) 


router2.get('/:id', async (req,res) => {  // dynamic route

    const blog = await Blog.findById(req.params.id).populate('createdBy')
   
    const comments = await Comment.find({ blogId: req.params.id}).populate(
        'createdBy'
    )
    // console.log('blog', blog)
    // console.log('comments', comments)
    return res.render('blog' , {

        user : req.user,
         blog,
         comments,
    })
})


router2.post('/comment/:blogid' , async(req, res) => {

     await Comment.create({

        content : req.body.content,
        blogId : req.params.blogid,
        createdBy : req.user._id,
    })

    return res.redirect(`/blog/${req.params.blogid}`)
} )

module.exports = router2;  
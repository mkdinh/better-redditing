// IMPORT MODULES
// ---------------------------------------------------------------------
const router = require('express').Router();
const Post = require('../models/Posts.js');
const Comment = require('../models/Comments.js');
// HANDLE HTTP REQUEST
// ---------------------------------------------------------------------

router.get('/save/:id', (req,res) => {
    Post.findOneAndUpdate({_id: req.params.id}, {saved: true},{new: true}, (err, post) => {
        res.send(err || post);
    });
});


router.get('/unsave/:id', (req,res) => {
    Post.findOneAndUpdate({_id: req.params.id}, {saved: false},{new: true}, (err, post) => {
        res.send(err || post);
    });
});

router.get("/saved/:subreddit", (req,res) => {
    Post.find({subreddit: req.params.subreddit, saved: true}).populate("comment").exec((err,posts) =>{
        res.send(err || posts);
    })
})

router.post('/comment/:id', (req,res) => {
    let comment = new Comment(req.body);
    comment.save((err,comment) => {
        Post.findOneAndUpdate({_id: req.params.id},{$set: {comment: comment._id, saved: true} },{new: true}, (err, post) => {
            res.send(err || comment)
        })
    })
})


// EXPORTING ROUTER TO SERVER.JS
// ---------------------------------------------------------------------
module.exports = router;
// IMPORT EXPRESS ROUTER FUNCTION
// ---------------------------------------------------------------------
const cherrio = require('cheerio');
const request = require('request');
const router = require('express').Router();
const mongoose = require('mongoose');
const Subreddit  = require('../models/Subreddits.js')
const Post = require('../models/Posts.js');
// HANDLE HTTP REQUEST
// ---------------------------------------------------------------------

router.get('/', (req,res) => {
    res.render('index');
})

router.get("/subreddit/all", (req,res) => {
    Subreddit.find((err, subreddits) => {
        res.send(err || subreddits)
    });
})

router.get("/scrape/:subreddit", (req,res) => {
    let options = {
        url: `https://www.reddit.com/r/${req.params.subreddit}/`,
        followRedirect: false
    }
    
    request(options, (error,response, html) => {
        if(error){
            res.send(error)
        }else if(response.statusCode !== 200){   
            res.status(500).send({msg: "No subreddit was found"})
        }else{
            
            // load subreddit html with cherrio
            var $ = cherrio.load(html);


            // create new subreddit model
            var subreddit = Subreddit({
                name: req.params.subreddit
            });

            Subreddit.findOneAndUpdate(
                {name: req.params.subreddit}, 
                {$unset: {posts: 1}, $set: {lastUpdated: Date.now()}}, 
                {upsert: true, new: true}, 
                (err, doc) => {
                    if(err){
                        console.log(err);
                    }else{

                        let count = 0;

                        // referencing individual posts
                        $('div.thing').each((i, element) => {
                            
                            // empty post object for scraping info
                            let post = {};
                            
                            // scraping info from subreddit
                            post.subreddit = req.params.subreddit;
                            post.rank = parseInt($(element).find("span.rank").text()) || 0;
                            post.title = $(element).find('a.title').text();
                            post.link = $(element).find('li.first').children('a').attr('href')
                            post.img = $(element).find('a.thumbnail').children('img').attr('src');
                            post.upvote = $(element).find('div.score.unvoted').text();


                            let postDB = new Post(post)

                            // append post into database
                            postDB.save((err,post) => {
                                if(err){
                                    console.log(err);
                                }else{
                                    
                                    Subreddit.findOneAndUpdate({name: req.params.subreddit}, {$push: {"posts": post._id}}, (err,resPost) => {
                                        // increase counter
                                        count++;
            
                                        // if counter reaches desired number of post, send populate subreddit doc
                                        if(count === 25){
                                            Subreddit.findOne({name: req.params.subreddit})
                                                .populate({path: "posts", match: {rank: {$gt: 0} } , options: {sort: {rank:1}}})
                                                .exec((err,subreddit) => {
                                                    res.send(err || subreddit)
                                                })
                                        }
                                    })
                                }
                            })
                        });
                };
            });
        };
    });
});

router.get('/scrape/post/:id', (req,res) => {
    Post.findById(req.params.id, (err,post) => {
        let link = post.link;

        request(link, (error,response, html) => {
            let $ = cherrio.load(html);
            let content = $('div.expando').html();

            Post.findOneAndUpdate({_id: req.params.id}, {$set: {content: content}}, (err, post) => {
                res.send(err || post);
            });
        });
    });
});



// EXPORTING ROUTER TO SERVER.JS
// ---------------------------------------------------------------------
module.exports = router;

 // scrape comment page for content data
//  request(post.link, (error, response, content) => {
//     var $ = cherrio.load(content)
//     post.content = $('div.expando').html();
//     // save post object into mongodb
//     var postdb  = new Post(post);
    
//     postdb.save((err, data) => {
//         if(err){
//             console.log(err)
//         }else{
//             // update push objectId into reference array of subreddit
//             Subreddit.findOneAndUpdate({name: req.params.subreddit}, {$push: {"posts": data._id}}, {new: true}, (err, subreddit) => {
//                 if(err){
//                     console.log(err);
//                 }else{
//                     // update counter
//                     count++;
                    
//                     // if a certain number of post is founded, send populated document to client
//                     // sort by rank from top to bottom
//                     if(count === 26){
//                         Subreddit.findOne({name: req.params.subreddit}).populate({
//                                 path: 'posts',
//                                 options: {sort: {rank: 1}}
//                             })
//                             .exec((err, subPosts) => {
//                                 res.send(err || subPosts)
//                         })
//                     }
//                 };
//             });
//         };
//     });
// });
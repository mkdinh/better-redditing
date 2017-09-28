// require Mongoose
const mongoose = require('mongoose');

// create sub reddit post schema
var CommentSchema = new mongoose.Schema({
    title: {
        type: String
    },
    body: {
        type: String
    }
})

// Create subreddit model with schema
var Comments = mongoose.model("Comment", CommentSchema)

// Export the model
module.exports = Comments;
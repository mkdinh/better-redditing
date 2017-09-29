// require Mongoose
const mongoose = require('mongoose');

// create sub reddit post schema
var PostSchema = new mongoose.Schema({
    subreddit: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        require: true
    },

    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    content:{
        type: String
    },
    upvote: {
        type: String,
        required: true,
        default: "NaN"
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    }
})

// Create subreddit model with schema
var Post = mongoose.model('Post', PostSchema);

// Export the model
module.exports = Post;
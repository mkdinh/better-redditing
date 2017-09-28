// require Mongoose
const mongoose = require('mongoose');

// create sub reddit post schema
var SubredditSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    favorite: {
        type: Boolean,
        required: true,
        default: false
    },
    lastUpdated: {
        type: String,
        required: true,
        default: Date.now
    }
})

// Create subreddit model with schema
var Subreddit = mongoose.model('Subreddit', SubredditSchema);

// Export the model
module.exports = Subreddit;
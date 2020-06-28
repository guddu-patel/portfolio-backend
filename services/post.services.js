const Post = require('../models/Post');

//return latest inserted posts
exports.getLatestPosts = async (req, res) => {
    let latestPosts = '';
    await Post.find().sort({_id: -1}).limit(5).exec()
        .then(posts => {
            latestPosts = posts;
        })
        .catch(err => {
            console.log(err);
        });

    return latestPosts;
}


//return random 5 posts
exports.getMostlyViewedPosts = async (req, res) => {
    const count = await Post.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const randomDoc = await Post.find().limit(5).skip(rand).exec();
    return randomDoc;
}
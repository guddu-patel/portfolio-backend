const Post = require('../models/Post');
const { postValidation }  = require('../validation');

// post create controller
exports.create_post = async (req, res) => {
    //validate
    const {error} = postValidation(req.body);
    if (error) return res.status(400).json({success:false, message:error.details[0].message});

    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        slug: req.body.slug,
        post_image: req.file.path
    });
    await post.save()
        .then(resp => {
            res.status(200).json({success: true, message: 'New post created successfully', post: post._id});
        })
        .catch(err => {
            res.status(400).json({success: false, message: err});
        });
};

// post update controller
exports.update_post = async (req, res) => {
    //validate
    const {error} = postValidation(req.body);
    if (error) return res.status(400).json({success:false, message:error.details[0].message});

    const post = {
        title: req.body.title,
        description: req.body.description,
        slug: req.body.slug,
    };

    await Post.findByIdAndUpdate(req.params.postId, post, {new:true})
        .then(post => {
            res.status(200).json({success: true, message: 'PostControllers updated successfully', post: post._id});
        })
        .catch(err => {
            res.status(400).json({success: false, message: err});
        });
};

// list all posts controller
exports.list_all_posts = async (req, res) => {
    await Post.find()
        .then(posts => {
            res.status(200).json({success: true, posts: posts});
        })
        .catch(err => {
            res.status(400).json({success: false, message: err});
        });
};

// get single post from id
exports.find_one_post = async (req, res) => {
    await Post.findById(req.params.postId)
        .then(post => {
            if(!post)
                res.status(404).json({success: false, message: 'No any post found with id ' + req.params.postId});
            res.status(200).json({success: true, post: post});
        })
        .catch(err => {
            res.status(400).json({success: false, message: err});
        });
};

// delete a single post from id
exports.delete_post = async (req, res) => {
    await Post.findByIdAndRemove(req.params.postId)
        .then(post => {
            if (!post) {
                res.status(404).json({success: false, message: 'No any post found with id ' + req.params.postId});
            }else {
                res.status(200).json({success: true, message: 'PostControllers deleted successfully'});
            }
        })
        .catch(err => {
            res.status(400).json({success: false, message: err});
        });
};
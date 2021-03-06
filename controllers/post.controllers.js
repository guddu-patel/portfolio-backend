const Post = require('../models/Post');
const { postValidation } = require('../validation');
const postService = require('../services/post.services');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// multer disk storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        // validate
        const { error } = postValidation(req.body);
        if (error) return cb(error.details[0].message, false);

        cb(null, `${file.fieldname}-${Date.now()}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`);
    }
});

// to filter the incoming file requests
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
        return cb(null, true)
    } else {
        return cb('Only images with type .jpg, .jpeg, .png & .gif are allowed', false);
    }
}

// set upload options of multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter,
}).single('post_image');


// post create controller
exports.create_post = async (req, res) => {
    // works on handling multer error
    await upload(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size too large. Only file upto 5MB is allowed.'
                } else {
                    err.message = 'File was not able to be uploaded.';
                }
                err = err.message;
            }
            return res.status(400).json({ success: false, message: err });
        }
        else {
            if (req.file === undefined) {  // check if the file exits
                return res.status(400).json({ error: false, message: 'Please select blog image first' })
            } else {
                handlePostCreate(req, res);
            }
        }
    });

};

const handlePostCreate = async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        slug: req.body.slug,
        post_image: req.file.path,
        page_content: req.body.page_content,
        category: (req.body.category).toLowerCase(),
    });
    await post.save()
        .then(resp => {
            res.status(200).json({ success: true, message: 'New post created successfully', post: post._id });
        })
        .catch(err => {
            res.status(400).json({ success: false, message: err });
        });
}

// post update controller
exports.update_post = async (req, res) => {

    // works on handling multer error on post update
    await upload(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    err.message = 'File size too large. Only file upto 5MB is allowed.'
                } else {
                    err.message = 'File was not able to be uploaded.';
                }
                err = err.message;
            }
            return res.status(400).json({ success: false, message: err });
        }

        else {
            const post = {
                title: req.body.title,
                description: req.body.description,
                slug: req.body.slug,
                page_content: req.body.page_content,
                category: (req.body.category).toLowerCase(),
            };

            if(req.file){
                post.post_image = req.file.path;
            }else{
                //validate
                const {error} = postValidation(req.body);
                if (error) return res.status(400).json({success: false, message: error.details[0].message});
            }

            //return res.send(post);
            handlePostUpdate(req, res, post);
        }
    });
};

// handle post update
const handlePostUpdate = async (req, res, post) => {

    Post.findById(req.params.postId).select('post_image')
        .then(doc => {
            fs.unlinkSync(doc.post_image);
        }).catch(er => {
            console.log(er);
    });

    await Post.findByIdAndUpdate(req.params.postId, post, { new: true })
        .then(post => {
            res.status(200).json({ success: true, message: 'Post updated successfully', post: post._id });
        })
        .catch(err => {
            res.status(400).json({ success: false, message: err });
        });
}

// list all posts controller
exports.list_all_posts = async (req, res) => {
    const {page, limit, category} = req.query;
    const options = {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        sort: { '_id': -1 },
    }
    // works on category wise post filter
    const filter = (category === undefined || category === '') ? {} : { "category": { "$regex": category.toLowerCase(), "$options": "i" } };
    await Post.paginate(filter, options)
        .then(posts => {
            res.status(200).json({ success: true, posts: posts });
        })
        .catch(err => {
            res.status(400).json({ success: false, message: err });
        });
};

// get single post from id
exports.find_one_post = async (req, res) => {
    const latestPosts = await postService.getLatestPosts(req, res);
    const mostlyViewedPosts = await postService.getMostlyViewedPosts(req, res);

    await Post.findById(req.params.postId)
        .then(post => {
            if (!post)
                res.status(404).json({ success: false, message: 'No any post found with id ' + req.params.postId });
            res.status(200).json({ success: true, post: post, latestPosts: latestPosts, mostlyViewedPosts: mostlyViewedPosts });
        })
        .catch(err => {
            res.status(400).json({ success: false, message: err });
        });
};

// delete a single post from id
exports.delete_post = async (req, res) => {
    await Post.findByIdAndRemove(req.params.postId)
        .then(post => {
            if (!post) {
                res.status(404).json({ success: false, message: 'No any post found with id ' + req.params.postId });
            } else {
                fs.unlinkSync(post.post_image);
                res.status(200).json({ success: true, message: 'Post deleted successfully' });
            }
        })
        .catch(err => {
            res.status(400).json({ success: false, message: err });
        });
};

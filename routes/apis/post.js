const router = require('express').Router();
// const verify = require('./verifyToken');
const verify = require('../../middleware/check-auth');
const postController = require('../../controllers/post.controllers');

// insert new post
router.post('/', postController.create_post);

// update a post
router.put('/:postId', verify, postController.update_post);

// list all posts
router.get('/', verify, postController.list_all_posts);

// Retrieve a single post with id
router.get('/:postId', verify,postController.find_one_post);

// Delete a post with id
router.delete('/:postId', verify,postController.delete_post);

module.exports = router;
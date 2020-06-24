const router = require('express').Router();
const multer = require('multer');
const path = require('path');
// const verify = require('./verifyToken');
const verify = require('../../middleware/check-auth');
const postController = require('../../controllers/post.controllers');

// multer disk storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}.${file.originalname.split('.')[file.originalname.split('.').length -1]}`);
    }
});

// to filter the incoming file requests
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return cb(new Error('Only images are allowed'), false)
    }
    cb(null, true)
}

// set upload options of multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter,
}).single('post_image');

// insert new post
router.post('/', upload, (req, res) => {

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
           //return res.send(err);
            console.log(err);
        } else if (err) {
            //return res.send(err);
            console.log(err);
        }

        // Everything went fine.
    })

});

// update a post
router.put('/:postId', verify, postController.update_post);

// list all posts
router.get('/', verify, postController.list_all_posts);

// Retrieve a single post with id
router.get('/:postId', verify,postController.find_one_post);

// Delete a post with id
router.delete('/:postId', verify,postController.delete_post);

module.exports = router;
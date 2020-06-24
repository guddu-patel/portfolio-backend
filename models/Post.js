const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const postScheme = new mongoose.Schema({
    title: { type: String, required: true  },
    description: { type: String, required: true  },
    slug: { type: String, required: true  },
    post_image: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Post', postScheme);
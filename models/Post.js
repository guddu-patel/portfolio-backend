const mongoose = require('mongoose');
const paginate = require('mongoose-paginate');
mongoose.set('useFindAndModify', false);

const postScheme = new mongoose.Schema({
    title: { type: String, required: true  },
    description: { type: String, required: true  },
    slug: { type: String, required: true  },
    post_image: { type: String, required: true },
}, { timestamps: true });

postScheme.plugin(paginate);
module.exports = mongoose.model('Post', postScheme);
const faker = require('faker');
const Post = require('../models/Post');

exports.seeder = async (req, res) => {
    await Post.deleteMany();
    let addedData = 0;
    for (let counter = 1; counter <= 100; counter++) {
        const post = new Post({
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraphs(),
            slug: faker.lorem.slug(),
            post_image: 'public\\uploads\\'+counter+'.jpg',
            page_content: faker.lorem.paragraph(),
            category: ['news', 'technical', 'educational', 'entertainment'].sample()
        });

        await post.save()
            .then(resp => {
                addedData = addedData+1;
            })
            .catch(err => {
                res.status(400).json({ success: false, message: err });
            });
    }

    res.status(200).json({ success: true, message: `Seeder complete with ${addedData} data added.` });
}

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}
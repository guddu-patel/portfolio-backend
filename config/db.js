const mongoose = require('mongoose');
require('dotenv').config();

const db = {
    database: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@db1-nnjqz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    secret: `${process.env.DB_PASS}`
}

// database connection
mongoose.connect(db.database, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(error => {
        console.log(`Unable to connect to the database`, error);
    });
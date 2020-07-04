const mongoose = require('mongoose');
require('dotenv').config();

// database user and secret
const db = {
    database: process.env.DB_URL,
    secret: process.env.DB_PASS
}

// database connection
mongoose.connect(db.database, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(error => {
        console.log(`Unable to connect to the database`, error);
    });
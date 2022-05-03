const mongoose = require('mongoose');
// const config = require('config');
require('dotenv').config()


// const mongoUri = 'mongodb+srv://ms29ash:aj7jE5I7NC1BuD0z@cluster0.bekxw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const mongoURI = process.env.MONGO_URI;

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log('connectToMongoose successfully')
    }).catch(err => console.log(err));
}
module.exports = connectToMongo;




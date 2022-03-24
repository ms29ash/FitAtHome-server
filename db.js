const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/fitathome?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'



const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log('connectToMongoose successfully')
    }).catch(err => console.log(err));
}
module.exports = connectToMongo;




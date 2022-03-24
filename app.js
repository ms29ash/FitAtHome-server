
const express = require('express');
const cors = require('cors');

const foodRouter = require('./routes/food');

//importing mongodb
const connectToMongo = require('./db')
const app = express();
app.use(cors())
app.use(express.json());

// Connecting to Database
connectToMongo();

/* Get port from environment and store in Express.*/

const port = process.env.PORT || '4000';
app.set('port', port);


// Using Routes
app.use('/', foodRouter);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


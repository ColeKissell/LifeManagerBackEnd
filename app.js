const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const url = 'mongodb://Admin:bmZ82ua47ZM3DAp@ds151814.mlab.com:51814/life-manager'
const app = express();

// allow cross-origin requests
app.use(cors());

// connect to mlab database
// make sure to replace my db string & creds with your own
mongoose.connect(url , {useNewUrlParser: true})
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});
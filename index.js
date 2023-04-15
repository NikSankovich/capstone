const express = require("express");
//const bodyParser = require("body-parser");

const path = require('path');

const authRoutes = require('./src/routes/authRoutes');

const messageRoutes = require('./src/routes/messageRoutes');

const app = express();
const port = process.env.PORT || 4001;

app.use(express.static('public'));

//app.use(bodyParser.json())

app.use(express.json());

app.use('/', authRoutes);

app.use('/', messageRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    // res.send('Welcome to our server!')
})

app.listen(port, () => {
    console.log(`Web server is listening on port ${port}!`);
});

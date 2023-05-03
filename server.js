const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const port = process.env.PORT || "8080";

// knex db //
const db = require('knex')({
    client: 'pg',
    connection: {
      host : process.env.DATABASE_URL
    //   port : 5432,
    //   user : 'postgres',
    //   password : 'VZjsNNsNCGMuLfB',
    //   database : 'face-detector-3000-be-db'
    }
});

// controllers //
const signIn = require('./controllers/signIn.js')
const registerUser = require('./controllers/registerUser.js');
const validateImage = require('./controllers/validateImage.js');
const rank = require('./controllers/rank.js');
const getProfile = require('./controllers/getProfile.js');
const callClarifai = require('./controllers/callClarifai.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// routes //

app.get('/', (req, res) => { res.send('Face Detector 3000 server is running') });

app.post('/signin', async (req, res) => {
    signIn.signIn(req, res, db, bcrypt)
})

app.post('/register', async (req, res) => {
    registerUser.registerUser(req, res, db, bcrypt);
})

app.post('/validate-image', async (req, res) => {
    validateImage.validateImage(req, res);
})

app.post('/face-detect', (req, res) => {
    callClarifai.faceDetect(req, res);
})

app.post('/color-recognition', (req, res) => {
    callClarifai.colorRecognition(req, res);
})

app.put('/rank', (req, res) => {
    rank.rank(req, res, db);
})

// not currently used //
app.get('/profile/:id', (req, res) => {
    getProfile.getProfile(req, res, db);
})

// start server //
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
})
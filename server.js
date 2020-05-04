const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

// use for development mode
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres", // change as approppriate
    password: "password", // change password
    database: "face-detection" // change name 
  }
});

/* for deployment on heroku
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});*/


const register = require('./controllers/register')
const deleteAccount = require('./controllers/delete')
const signin = require('./controllers/signin')
const image = require('./controllers/image')
const profile = require('./controllers/profile')

const app = express();

app.use(express.json());
app.use(cors());

const port = 3001;

// app.get("/", (req, res) => res.send('success'));
app.post("/register", (req, res) => {register.handleRegister(req, res, db, bcrypt)});
app.post("/signin", signin.handleSignin(db, bcrypt));
// app.get("/profile/:id", (req, res) => profile.handleProfile(req, res, db));
app.put("/image", (req, res) => {image.handleImage(req, res, db)});
app.post("/imageClarifai", (req, res) => {image.handleClarifaiApi(req, res)});
app.delete("/deleteAccount", (req, res) => {deleteAccount.deleteAccount(req, res, db)});


app.listen(process.env.PORT || port, () => {
  console.log(`app running on port ${port}`);
});

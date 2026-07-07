const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/authRoutes');
const cookie = require('cookie-parser');
const { requireauth, currectuser } = require('./middelware/authMiddelware');

const app = express();

const dbURL = 'mongodb://localhost:27017/';

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookie());

// view engine

app.set('view engine', 'ejs');

mongoose.connect(dbURL)
.then(() => app.listen(5000))
.then(() => console.log('connected to db'))
.catch((err) => console.log(err));

app.use(currectuser);
app.get('/' , (req,res) =>{
    res.render('index');
});



app.use(routes);
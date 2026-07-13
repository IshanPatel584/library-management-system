const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/authRoutes');
const cookie = require('cookie-parser');
const { requireauth, currectuser } = require('./middelware/authMiddelware');
require('dotenv').config();

const app = express();


// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookie());

// view engine

app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI)
.then(() => app.listen(process.env.PORT))
.then(() => console.log('connected to db'))
.catch((err) => console.log(err));

app.use(currectuser);




app.use(routes);
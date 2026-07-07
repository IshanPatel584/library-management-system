const {Router} = require('express');
const authcontroller = require('../controlles/authControlles');
const {requireauth} = require('../middelware/authMiddelware');


const routes = Router();

routes.get('/signup' , authcontroller.signup_get);
routes.post('/signup' , authcontroller.signup_post);
routes.get('/login' ,authcontroller.login_get);
routes.post('/login' , authcontroller.login_post);
routes.get('/books' , requireauth, authcontroller.books_get);
routes.post('/books'  ,  authcontroller.books_post);
routes.get('/logout' ,authcontroller.logout_get);
routes.get('/view-books' , requireauth ,authcontroller.view_books_get);

module.exports = routes;
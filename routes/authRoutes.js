const {Router} = require('express');
const authcontroller = require('../controlles/authControlles');
const {requireauth} = require('../middelware/authMiddelware');
const {requireAdmin} = require('../middelware/authMiddelware');


const routes = Router();

routes.get('/signup' , authcontroller.signup_get);
routes.post('/signup' , authcontroller.signup_post);
routes.get('/login' ,authcontroller.login_get);
routes.post('/login' , authcontroller.login_post);
routes.get('/books' , requireAdmin, authcontroller.books_get);
routes.post('/books'  ,  authcontroller.books_post);
routes.get('/logout' ,authcontroller.logout_get);
routes.get('/view-books' , requireauth ,authcontroller.view_books_get);

routes.get('/users', requireAdmin, authcontroller.users_get);
routes.post('/users/delete/:id', requireAdmin, authcontroller.delete_user_post);
routes.post('/users/role/:id', requireAdmin, authcontroller.change_role_post);

module.exports = routes;
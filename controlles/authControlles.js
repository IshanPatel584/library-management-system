const User = require('../models/User');
const Books = require('../models/Books');
const jwt =  require('jsonwebtoken');
const requireAuth = require('../middelware/authMiddelware');

const handelError = (err) =>{
    let errors = {email : '' , password:''};

    if(err.message === 'Incorrect Email'){
        errors.email = 'this email is not register';
    }
    if(err.message === 'Incorrect Password'){
        errors.password = 'this password is incorrect';
    }

    if(err.code === 11000){
        errors.email = 'this email already exist';
        return errors;
    }

    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message;
        });
    }

    return errors;

}

const handelBookError = (err) => {
    let errors = {title:'' , author:'' , ISBN:''};

    if(err.code === 11000){
        errors.book = 'this book already exist';
        return errors;
    }
    if(err.message.includes('book validation failed')){
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}
const createtoken = (id) =>{
    return jwt.sign(
    { id },
    process.env.JWT_SECRET
);
}

module.exports.signup_get = (req,res) => {
    res.render('signup');
}

module.exports.login_get = (req,res) => {
    res.render('login');
}

module.exports.signup_post = async (req,res) => {
    const {email , password} = req.body;
    try {
        const user = await User.create({email , password});
        const token = createtoken(user._id);
        res.cookie('jwt' , token,{httpOnly:true})
        res.status(200).json({user : user._id});
    } catch (err) {
        const handelerror = handelError(err);
        res.status(400).json({errors: handelerror});
    }
}
module.exports.login_post = async (req,res) => {
    const {email , password} = req.body;

    try {
        const user = await User.login(email,password);
        const token = createtoken(user._id);
        res.cookie('jwt' , token , {httpOnly : true , maxAge : maxAge *1000});
        res.status(200).json({user: user._id})
    } catch (err) {
        const handelerror = handelError(err)
        res.status(400).json({errors: handelerror});
    }


}
module.exports.books_get = (req,res) => {
    res.render('Books');
}
module.exports.books_post = async (req,res) => {
    const {title , author , ISBN} = req.body;
    try {
        const book = await Books.create({title , author , ISBN});
        res.status(200).json({ book: book._id });
    } catch (err) {
        const handelerror = handelBookError(err);
        res.status(400).json({ errors: handelerror });
    }
}
const maxAge = 1000*60*60*60*24;
module.exports.logout_get = (req,res) =>{
    res.cookie('jwt' , '' , {maxAge : 1});
    res.redirect('/');
}

module.exports.view_books_get = async (req,res) => {
    const books = await Books.find();
    res.render('viewbooks', { books });
}
module.exports.users_get = async (req, res) => {
    const users = await User.find();
    res.render('users', { users });
}

module.exports.change_role_post = async (req, res) => {
    
    
    try{
        const userid = req.params.id;
        const user = await User.findById(userid);

        if (!user) {
            return res.status(404).send("User not found");
        }

        if (user.role === "user") {
            user.role = "admin";
        } else {
            user.role = "user";
        }

        await user.save();

        res.redirect('/users');
    }
    catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}

module.exports.delete_user_post = async (req,res) =>{
    try{
        const userid = req.params.id;
        const user = await User.findByIdAndDelete(userid);

        res.redirect('/users');

    }
    catch(err){
        console.log(err);
    }
}
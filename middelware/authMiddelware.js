const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireauth = (req,res,next) =>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token , process.env.JWT_SECRET , (err ,decodedtoken) =>{
            if(err){
                res.redirect('/login');
            }
            else{
                console.log(decodedtoken);
                next();
            }
        })
    }else{
        res.redirect('/login');
    }
}


const currectuser = (req,res, next) =>{
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token , process.env.JWT_SECRET , async (err , decodedtoken) =>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else{
                console.log(decodedtoken);
                let user = await User.findById(decodedtoken.id);
                console.log(user.role);
                res.locals.user = user;
                req.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
};

const requireAdmin = (req,res,next) =>{
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token , process.env.JWT_SECRET , async (err , decodedtoken) =>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else{
                console.log(decodedtoken);
                let user = await User.findById(decodedtoken.id);
                if(user.role === 'admin'){
                    next();
                }
                else{
                    res.redirect('/');
                }
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = {requireauth , currectuser , requireAdmin};
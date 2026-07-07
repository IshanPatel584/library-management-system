const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true , 'Please enter the title']
    },
    author:{
        type:String,
        required:[true , 'Please enter the Author of book']
    },
    ISBN:{
        type:Number,
        required:[true , 'Please enter the ISBN'],
        unique:true
    }
});

const Books = mongoose.model('book' , bookSchema);

module.exports = Books;
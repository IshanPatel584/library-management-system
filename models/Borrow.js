const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required : true
    },
    book :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'book',
        required : true
    },
    borrowdate:{
        type:Date,
        default:Date.now
    },
    dueDate: {
        type: Date
    },

    status: {
        type: String,
        enum: ['borrowed', 'returned'],
        default: 'borrowed'
    }
});
const Borrow= mongoose.model('borrow' , borrowSchema);

module.exports = Borrow;
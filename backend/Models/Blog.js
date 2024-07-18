const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    photo : {
        type : String
    },
    description : {
        type : String,
        required : true
    },
    categories : {
        type : Array,
        required : true
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
}, { timestamps : true })

module.exports = mongoose.model('Blog', BlogSchema);
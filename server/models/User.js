const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    customerName: String,
    tip:{
        type: Number
    },
    customerId: {
        type:String
    },
    orders:[]
})

module.exports = mongoose.model('User', UserSchema)
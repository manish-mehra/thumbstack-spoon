const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    customerName: String,
    customerId: {
        type:String
    },
    orders:[],
    tip:Number,
    subTotal: Number,
    total: Number
})

UserSchema.pre('save', async function(){
    this.total = (this.tip/100 * this.subTotal) + this.subTotal
})

module.exports = mongoose.model('User', UserSchema)
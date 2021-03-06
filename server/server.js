require('dotenv').config()
const express = require("express");
const socket = require("socket.io");
const index = require('./routes/index')
const User = require('./models/User')
const uniqid = require('uniqid')
const cors = require('cors')
const bodyParser = require('body-parser')
// App setup
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
//database
const connectDB = require('./db/connect')
app.use(index) //routes


const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
})



// Socket setup
const io = socket(server)



io.on("connection", async function (socket) {
  console.log("Made socket connection")
  //connect to mongodb
  await connectDB(process.env.MONGO_URL)
  console.log("connected to mongodb")

  //on new user
  socket.on('new-user', async function(userNameInput, orders){
    let customerId = uniqid()
    let tip = 0
    let customerName = userNameInput
    const user = await User.create({customerName, tip, customerId, orders, total: 0, subTotal: 0})   //create a user in mongodb
    io.emit("get-user", user)
  })
  

  socket.on('placing-order', async function (orders, customerId){
    const user = await User.findOne({customerId: customerId})
    user.orders = orders
    await user.save()
    // let totalAmount = user.orders.reduce(function (acc, obj){ return parseInt(acc) + parseInt(obj.price)}, 0) //calculate total amount
    io.emit("order-placed", orders, user) // perform calculation
  })

  socket.on('generate-customer-bill', async (user)=>{
    const customerBill = user.orders.reduce((acc, curr) => {
      curr.qty = 1;
      const exists = acc.find(o => o.dishName === curr.dishName && o.price === curr.price);
      exists ? exists.qty++ : acc.push(({ dishName, price, qty } = curr));
      return acc;
    }, []); //merge items with same id and add new property "qty"
    const newCustomerBill = customerBill.map((item)=> ({...item, total: item.price*item.qty}))
    const subTotal = newCustomerBill.reduce((acc, curr)=>{
      acc += curr.price * curr.qty
      return acc
    }, 0)

    const olduser = await User.findOne({customerId: user.customerId})
    olduser.subTotal = subTotal
    olduser.orders = newCustomerBill
    await olduser.save()
    io.emit('customer-bill', newCustomerBill, subTotal)
  })

  socket.on('pay-tip', async (customerId, inputTip)=>{
    const user = await User.findOne({customerId: customerId})
    user.tip = inputTip
    await user.save()
    io.emit('tip-given', user)
  })


  socket.on("disconnect", ()=>{
      console.log("disconnected")
  })

});

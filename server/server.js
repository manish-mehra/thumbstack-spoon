require('dotenv').config()
const express = require("express");
const socket = require("socket.io");
const index = require('./routes/index')
const User = require('./models/User')
const uniqid = require('uniqid')
// App setup
const PORT = process.env.PORT || 4000;
const app = express();
app.use(index)

//database
const connectDB = require('./db/connect')

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
    const user = await User.create({customerName, tip, customerId, orders})   //create a user in mongodb
    console.log(user)
    io.emit("get-user", user)
  })
  

  socket.on('placing-order', async function (orders, customerId){
    const user = await User.findOne({customerId: customerId})
    user.orders = orders
    await user.save()
    // let totalAmount = user.orders.reduce(function (acc, obj){ return parseInt(acc) + parseInt(obj.price)}, 0) //calculate total amount
    io.emit("order-placed", orders, user) // perform calculation
  })

  socket.on('generate-customer-bill', (orders)=>{
    const customerBill = orders.reduce((acc, curr) => {
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

import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom"
import { SocketContext } from '../context/socket' 
import { useUserContext } from "../context/user"

const orders= [
  {
    id: 1,
    dishName: "Yellow Dal",
    price: "199",
    image: "https://rice99.com/images/yellow-dal.png"
  },
  {
    id: 2,
    dishName: "Matar Paneer + Rice",
    price: "139",
    image: "https://rice99.com/images/matar-paneer.png"
  },
  {
    id: 3,
    dishName: "Chole Rice",
    price: "254",
    image: "https://rice99.com/images/chole-rice.png"
  },
  {
      id: 4,
      dishName: "Kadhi + Rice",
      price: "129",
      image: "https://rice99.com/images/kadhi-rice.png"
  },
  {
      id: 5,
      dishName: "Rajma + Rice",
      price: "207",
      image: "https://rice99.com/images/rajma-rice.png"
  },
  {
      id: 6,
      dishName: "Dal Makhani",
      price: "249",
      image: "https://rice99.com/images/veg-biryani.png"
  },
  {
      id: 7,
      dishName: "Veg Biryni",
      price: "189",
      image: "https://rice99.com/images/veg-biryani.png"
  },

]


export default function PlaceOrder() {
    const [response, setResponse] = useState("");
    const [items, setItems] = useState([])
    const [userNameInput, setUserNameInput] = useState('')
    const [finalOrderItems, setFinalOrderItems] = useState([])
    const [orderStatus, setOrderStatus] = useState('')
    const {user, setUser} = useUserContext()
    // const [totalAmount, setTotalAmount] = useState('')

    const socket = useContext(SocketContext)

    useEffect(()=>{
        // return () => socket.disconnect(); //cleanup
    }, [])
    
    const placeOrderHandler = (e)=>{
        e.preventDefault()
        setOrderStatus('placing order')
        socket.emit("placing-order", items, user.customerId)
        socket.on("order-placed", (orders, user)=>{
        setFinalOrderItems(orders)
        setUser(user) //updated user detail
        setOrderStatus('order placed')
        })
    }

    const addItemHandler = (order)=>{
        setItems((prev)=>[...prev, order])
    }
  
    const newUserHandler = (e)=>{
        e.preventDefault()
        console.log("newuser")
        socket.emit("new-user", userNameInput, items)
        socket.on("get-user", (user)=>{
            setUser(user)
        })
    }


  return (
    <div className="w-1/2 mb-4">
        {
            user? 
                <div className="">

                    <div className="flex justify-between bg-green-200 p-2 mb-2">
                        <p className="font-medium">{user.customerName.toUpperCase()}</p>
                    <span className="flex items-center gap-1">
                        <p className="text-xs">Customer Id:</p>
                        <p className="text-sm text-red-500 font-medium">{user.customerId}</p>
                    </span>
                    </div>
                <div className="flex-col">
                <p className="text-lg font-medium">Menu</p>
                    <ul>
                    {
                        orders.map((order)=> 
                        <li 
                            key = {order.dishName}
                            className = "flex-col"
                        >
                            <span  className="flex justify-between items-center">
                                <p>{order.dishName}</p>
                                <span className="flex gap-2 items-center">
                                <p>₹ {order.price}</p>
                                <img 
                                className="w-28"
                                src={order.image} alt={order.dishName + "image"} />
                                </span>
                            </span>
                            <button 
                            className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white text-center py-2 px-4 rounded"
                            onClick = {()=>addItemHandler(order)}>Add Item</button>
                        </li>)
                        }
                    </ul>
                </div>

                    
                    <div className="absolute top-0 left-0 flex-col bg-gray-100 px-5 py-2 gap-6">
                        
                        <p className="text-lg font-semibold">Total Items: {items.length}</p>
                        <p className="text-lg font-semibold">Total: {items.reduce(function (acc, obj){ return parseInt(acc) + parseInt(obj.price)}, 0)}</p>
                        <button 
                        className="bg-green-200 hover:bg-green-500 hover:text-white  text-center py-1 px-1 text-lg font-medium"
                        onClick={placeOrderHandler}>Order Now!</button>
                        <p>{orderStatus}</p>
                        <div className="mt-4">
                            <Link to="/checkout" className="bg-blue-200 hover:bg-blue-500 hover:text-white  text-center py-1 px-1 text-lg font-medium">Checkout</Link>
                        </div>
                        
                        
                    </div>
                    
            </div>
            :
            <div>
                <form onSubmit={newUserHandler}>
                    <p className="text-lg mb-3">Your name please!</p>
                    <input 
                    className="px-1 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring"
                    type="text" name="userInput" value={userNameInput} onChange = {(e)=>
                        setUserNameInput(e.target.value)
                    }/>
                    <input 
                    className="bg-green-200 hover:bg-green-500 hover:text-white text-green-500 text-center py-1 px-1 text-sm"
                    type="submit" value="Check Menu" />
                </form>
                
            </div>
        }


        
            

    </div>
  )
}

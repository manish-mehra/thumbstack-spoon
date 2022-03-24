import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom"
import { SocketContext } from '../context/socket' 
import { useUserContext } from "../context/user"

const orders= [
  {
    id: 1,
    dishName: "Rice and Curry",
    price: "199"
  },
  {
    id: 2,
    dishName: "Rajma",
    price: "200"
  },
  {
    id: 3,
    dishName: "Egg and rice",
    price: "254"
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
    <div>
        {
            user? 
                <div>
                <p>{user.customerName} || {user.customerId}</p>
                <p>Items</p>
                    <ul>
                    {
                        orders.map((order)=> 
                        <li 
                            key = {order.dishName}
                        >
                            <p>{order.dishName} || {order.price}</p>
                            <button onClick = {()=>addItemHandler(order)}>Add Item</button>
                        </li>)
                        }
                    </ul>

                    
                    <div>
                        <button onClick={placeOrderHandler}>Place Order</button>
                        <p>{orderStatus}</p>
                        <p>Total Items: {items.length}</p>
                        <p>Total: {items.reduce(function (acc, obj){ return parseInt(acc) + parseInt(obj.price)}, 0)}</p>
                    </div>
                    <Link to="/checkout">Checkout</Link>
            </div>
            :
            <div>
                <form onSubmit={newUserHandler}>
                    <p>Enter name</p>
                    <input type="text" name="userInput" value={userNameInput} onChange = {(e)=>
                        setUserNameInput(e.target.value)
                    }/>
                    <input type="submit" value="Check Menu" />
                </form>
                
            </div>
        }


        
            

    </div>
  )
}

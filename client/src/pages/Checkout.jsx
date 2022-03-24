import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from '../context/socket' 
import { useUserContext } from "../context/user"

export default function Checkout() {
    const {user, setUser} = useUserContext()
    const socket = useContext(SocketContext)


    const [customerBill, setCustomerBill] = useState([])
    const [subTotal, setSubTotal] = useState('')
    useEffect(()=>{
        console.log(user)
        socket.emit("generate-customer-bill", user.orders)
        socket.on('customer-bill', (newCustomerBill, subTotal)=> {
            setCustomerBill(newCustomerBill)
            setSubTotal(subTotal)
        })
        console.log(customerBill)
        console.log(subTotal)
    }, [])

    

  return (
    <div>
        <h1>Checkout</h1>
        <ul>
         {
            customerBill?.map((data)=> 
            <li key={data.dishName}>
                <p>{data.dishName}</p>
                <p>{data.price}</p>
                <p>{data.qty}</p>
                <p>{data.total}</p>
            </li>)
        } 
        </ul>
        <p>{subTotal}</p>
        
    </div>
  )
}

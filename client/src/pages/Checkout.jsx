import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from '../context/socket' 
import { useUserContext } from "../context/user"
import { ENDPOINT } from "../constants";

export default function Checkout() {
    const {user, setUser} = useUserContext()
    const socket = useContext(SocketContext)
    const [inputTip, setInputTip] = useState(0)
    const [tipStatus, setTipStatus] = useState('')

    const [customerBill, setCustomerBill] = useState([])
    const [subTotal, setSubTotal] = useState('')
    useEffect(()=>{
        socket.emit("generate-customer-bill", user)
        socket.on('customer-bill', (newCustomerBill, subTotal)=> {
            setCustomerBill(newCustomerBill)
            setSubTotal(subTotal)
        })
    }, [])

    const payTipHandler = ()=>{
        socket.emit("pay-tip", user.customerId, inputTip)
        socket.on('tip-given', (newUser)=> {
            setUser(()=>newUser)
        })
        setTipStatus('Your tip has been recieved. Thanks for coming!')
    }



  return (
    <div>
        <h1 className="mb-4 text-xl font-bold ">Checkout</h1>
        <ul className="flex-col gap-4 drop-shadow-md border max-w-xl">
        <li className="flex gap-10 justify-between bg-yellow-200 items-center ">
                <p className=" mb-4 font-medium pl-2">{user.customerName.toUpperCase()}</p>
                
                <p className=" mb-4 font-medium pr-2">{user.customerId}</p>
            </li>

            <li className="flex gap-10">
                <p className="w-28 mb-4 pl-2 font-medium">DishName</p>
                <p className="w-28 mb-4 pl-2 font-medium">price(₹)</p>
                <p className="w-28 mb-4 pl-2 font-medium">Quantity</p>
                <p className="w-28 mb-4 pl-2 font-medium">total</p>
            </li>
         {
            customerBill?.map((data)=> 
            <li key={data.dishName} className = "flex gap-10 border border-gray-200">
                <p className="w-28 mb-4 pl-2">{data.dishName}</p>
                <p className="w-28 mb-4 pl-2">{data.price}</p>
                <p className="w-28 mb-4 pl-2">{data.qty}</p>
                <p className="w-28 mb-4 pl-2 ">{data.total}</p>
      
            </li>)
        } 
        </ul>

        <div className="mb-10">
            <p className="font-semibold text-lg ">Total:₹ {subTotal}</p>
            <p className="text-xs text-red-500">Pay at the counter!</p>
        </div>
        
        <div className="flex gap-3 mt-4">
            <input 
            value={inputTip}
            onChange = {(e)=>setInputTip(e.target.value)}
            type="number" className="px-1 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring"/>
            <button 
            onClick={payTipHandler}
            className="bg-green-200 hover:bg-green-500 hover:text-white text-green-500 text-center py-2 px-4 rounded">Pay Tip %</button>
        </div>

        <div>
            <p className="text-sm text-gray-400 mt-3">{tipStatus}</p>
        </div>

        <div>
            {tipStatus? <div className="mt-6">
                <a 
                    href={`${ENDPOINT}/invoice/${user.customerId}`}
                    className="bg-red-200 hover:bg-red-500 hover:text-white text-gray-700 text-center py-2 px-4 rounded"
                    >Generate Restaurant Bill</a>
            </div>: null}            
        </div>

    </div>
  )
}

import React from 'react'
import io from "socket.io-client"
import { ENDPOINT } from '../constants'

export const socket = io(ENDPOINT, { transports: ['websocket'] })
export const SocketContext = React.createContext()
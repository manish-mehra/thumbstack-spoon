import React,{useState, useContext, createContext} from 'react'

const UserContext = createContext()

const UserProvider = ({children})=>{
    const [user, setUser] = useState(null)
    
    return <UserContext.Provider value = {{
        user, setUser
    }}>
        {children}
    </UserContext.Provider>
}

export const useUserContext = ()=>{
    return useContext(UserContext)
}

export {UserContext, UserProvider}
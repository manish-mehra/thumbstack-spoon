import PlaceOrder from './pages/PlaceOrder'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import PageWrapper from './components/PageWrapper'
// import { socket, SocketContext } from './context/socket'
import {UserProvider} from './context/user'
import {
  Routes,
  Route
} from "react-router-dom"

function App() {


  return (
    <>
      <UserProvider>
        <PageWrapper>
        <Routes>
          <Route path = "/" element = {<Home/>}/>
          <Route path = "/place-order" element = {<PlaceOrder/>}/>
          <Route path = "/checkout" element = {<Checkout/>}/>
        </Routes>
        </PageWrapper>
      </UserProvider>
    </>
  );
}

export default App;
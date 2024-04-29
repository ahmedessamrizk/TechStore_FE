import logo from './logo.svg';
import './App.css';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import { Provider } from 'react-redux';
import { Store } from './Redux/configStore';
import Signup from './Components/Signup/Signup';
import Admin from './Components/Admin/Admin';
import Cart from './Components/Cart/Cart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from './index.js';

function App() {
  const { pathname } = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [profile, setProfile] = useState(null);

  const getProfile = async () => {
    try {
      let { data } = await axios.get(`${baseURL}/user/profile`, {
        headers: {
          authorization: `test__${localStorage.getItem("token")}`,
        },
      });
      setProfile(data.user);

    }
    catch (error) {
      console.log(error);
    }
  }

  function ProtectedAdmin(props) {
    if (profile) {
      if (profile.admin >= 1) {
        return props.children;
      }
      else {
        return <Navigate to='/home' />
      }
    }
  }

  function ProtectedLogin(props) {
    if (!localStorage.getItem("token")) {
      return props.children;
    }
    else {
      return <Navigate to='/home' />
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getProfile();
    }
  }
    , [localStorage.getItem("token")])
  return <>
    <Provider store={Store}>
      <Navbar profile={profile} setProfile={setProfile} getProfile={getProfile} />
      <Cart setCartItems={setCartItems} cartItems={cartItems} />
      <Routes>
        <Route path='/' element={<Home setCartItems={setCartItems} cartItems={cartItems} />} />
        <Route path='/login' element={<ProtectedLogin><Login /></ProtectedLogin>} />
        <Route path='/signup' element={<ProtectedLogin><Signup /></ProtectedLogin>} />
        <Route path='/admin' element={<ProtectedAdmin> <Admin profile={profile} /> </ProtectedAdmin>} />
        <Route path='home' element={<Home profile={profile} setCartItems={setCartItems} cartItems={cartItems} />} />
      </Routes>
    </Provider>
  </>
}

export default App;

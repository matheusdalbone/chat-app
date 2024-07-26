import React, { useState, useRef } from "react";
import Auth from "../../components/Auth";
import { Navigate } from "react-router-dom";
import Chat from "../../components/Chat";
import { signOut } from "firebase/auth";
//Cookies
import Cookies from "universal-cookie";
import { auth } from "../../configs/firebase-config";
const cookies = new Cookies();

const Home = () => {
  const[isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const[room, setRoom] = useState(null);

  const roomInputRef = useRef(null);

  navi

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  }

  if(isAuth) {
    return (
      <> {room ? <Chat room={room}/> : <div>
      <label>
        Enter Room Name:
      </label>
      <input type="text" ref={roomInputRef}/>
      <button onClick={() => setRoom(roomInputRef.current.value)}>Enter Chat</button>
      </div>}

      <div>
        <button onClick={signUserOut}>
          Sign Out
        </button>
      </div>
      </>)
  } else {
    return <Auth setIsAuth={setIsAuth} />
  }
};

export default Home;
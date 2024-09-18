import React, { useState, useRef } from "react";
import styles from "./styles.module.css";
import Auth from "../../components/Auth";
import { useNavigate } from "react-router-dom";
import Chat from "../../components/Chat";
import { signOut } from "firebase/auth";
//Cookies
import Cookies from "universal-cookie";
import { auth } from "../../configs/firebase-config";
import Header from "../../components/Header";
const cookies = new Cookies();

const Home = () => {
  const[isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const[room, setRoom] = useState(null);

  const navigate = useNavigate();

  const roomInputRef = useRef(null);

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
  }

  if(isAuth) {
    return (
      <>
      {
        room ? navigate(`/room/${room}`) : <div>
        <Header title={"HOME"} onClick={signUserOut}/>
          <div className={styles.main}>
            <div className={styles.container}>
              <label>
                Enter Room Name:
              </label>
              <input type="text" ref={roomInputRef}/>
              <button className={styles.enterBtn} onClick={() => setRoom(roomInputRef.current.value)}>Enter Chat</button>
            </div>
          </div>
        </div>
      }
      </>)
  } else {
    return <Auth setIsAuth={setIsAuth} />
  }
};

export default Home;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../../components/Chat";
import ScreenShareReceiver from "../../components/Screen";
import styles from "./styles.module.css";
import Header from "../../components/Header";

const Room = () => {
  const[room, setRoom] = useState(null);
  const { roomID } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    setRoom(roomID);
  }, [])

  return (
    <>
      <Header room={room} title={"Room"}/>
      <div className={styles.main}>
        <ScreenShareReceiver />
        <div className={styles.chatSection}>
          <Chat room={room} />
        </div>
      </div>
    </>
  );
};

export default Room;
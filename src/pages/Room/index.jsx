import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../../components/Chat";
import styles from "./styles.module.css";

const Room = () => {
  const[room, setRoom] = useState(null);
  const { roomID } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    setRoom(roomID);
  }, [])

  return (
    <>
      <div className={styles.header}>
        <div>Room</div>
        <div>{room}</div>
        <button onClick={() => navigate("/")}>Leave</button>
      </div>

      <div className={styles.main}>
        <div className={styles.screenSection}>
          TELA
        </div>
        <div className={styles.chatSection}>
          <Chat room={room} />
        </div>
      </div>
    </>
  );
};

export default Room;
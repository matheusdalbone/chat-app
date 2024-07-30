import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chat from "../../components/Chat";
import Screen from "../../components/Screen";
import styles from "./styles.module.css";

const Room = () => {
  const[room, setRoom] = useState(null);
  const { roomID } = useParams();

  const navigate = useNavigate();

  const shareScreen = () => {
    navigator.mediaDevices.getDisplayMedia({video: true, audio: true}).then(stream => {
      const video = document.querySelector("video");
      video.srcObject = stream;
      video.onloadedmetadata = () => video.play();
      console.log(stream);
    })
  }

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
        <Screen shareScreen={() => shareScreen()}/>
        <div className={styles.chatSection}>
          <Chat room={room} />
        </div>
      </div>
    </>
  );
};

export default Room;
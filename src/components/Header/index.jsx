import React, { useState } from "react";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";

const Header = ( { room, title, onClick } ) => {
  const navigate = useNavigate();

  return (
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
      <div>{room}</div>
      {room ? <button className={styles.headerBtn} onClick={() => navigate("/")}>LEAVE</button> : <button className={styles.headerBtn} onClick={onClick}>SIGN OUT</button>}
  </div>
  );
};

export default Header;
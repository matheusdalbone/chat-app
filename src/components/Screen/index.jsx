import React from "react";
import styles from "./styles.module.css";

const Screen = ( props ) => {
  return (
    <div className={styles.container}>
      <video autoPlay className={styles.screen} />
      <div>
        <button onClick={props.shareScreen}>Share Screen</button>
      </div>
    </div>
  );
};

export default Screen;
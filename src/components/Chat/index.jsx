import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { auth, db } from '../../configs/firebase-config';

const Chat = (props) => {
  const { room } = props;

  const[newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const[messages, setMessages] = useState([]);
  const lastMessagesRef = useRef(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if(newMessage === "" || newMessage.trim().length === 0)
      return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room,
    });

    setNewMessage("");
  };

  useEffect(() => {
    const queryMessages = query(
      messagesRef,
      where("room", "==", room),
      orderBy("createdAt", "asc"),
    );

    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      })
      setMessages(messages);
    });

    return () => unsuscribe();
  }, [room]);

  return (
    <>
        <div className={styles.chat}>
          <div className={styles.chatMessages}>
            {messages.map((message) => (
              <div key={message.id}>
                <span>{message.user}: </span>
                <span>{message.text}</span>
              </div>
            ))}
          </div>

          <div ref={lastMessagesRef}></div>
        </div>
        <form onSubmit={handleFormSubmit} className={styles.formSection}>
          <input
            type="text"
            placeholder="Enter Message"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            className={styles.messageInput}
          />
          <button type="submit" className={styles.messageButton}>
            Send
          </button>
        </form>
    </>
  );
};

export default Chat;
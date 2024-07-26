import React, { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { auth, db } from '../../configs/firebase-config';

const Chat = (props) => {
  const { room } = props;

  const[newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");
  const[messages, setMessages] = useState([]);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if(newMessage === "")
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
  }, []);

  return (
    <div>
      <div>{messages.map((message) => (
        <div key={message.id}>
          <span>{message.user}: </span>
          <span>{message.text}</span>
        </div>
        ))}</div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text" placeholder='Enter Message'
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  )
};

export default Chat;
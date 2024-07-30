import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { collection, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../configs/firebase-config";

const Screen = (props) => {
  let peerConnection = null;
  let localStream = null;
  let remoteStream = new MediaStream();

  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  useEffect(() => {
    const setupRemoteStream = () => {
      const video = document.querySelector("#screenVideo");
      video.srcObject = remoteStream;
    };

    setupRemoteStream();

    const callDoc = doc(db, "calls", "currentCall");
    const unsubscribe = onSnapshot(callDoc, async (snapshot) => {
      const data = snapshot.data();
      if (data && !peerConnection) {
        await answerCall("currentCall");
      }
    });

    return () => unsubscribe();
  }, []);

  const shareScreen = async () => {
    try {
      localStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const video = document.querySelector("#screenVideo");
      video.srcObject = localStream;
      video.onloadedmetadata = () => video.play();
      createOffer();
    } catch (err) {
      console.log(err);
    }
  };

  const createOffer = async () => {
    peerConnection = new RTCPeerConnection(servers);

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        const docRef = doc(db, "calls", "currentCall");
        const candidatesCollection = collection(docRef, "offerCandidates");
        await setDoc(doc(candidatesCollection), event.candidate.toJSON());
      }
    };

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const callDoc = doc(db, "calls", "currentCall");

    await setDoc(callDoc, { offer: { type: offer.type, sdp: offer.sdp } });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        peerConnection.setRemoteDescription(answerDescription);
      }
    });

    const answerCandidatesCollection = collection(callDoc, "answerCandidates");
    onSnapshot(answerCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.addIceCandidate(candidate);
        }
      });
    });
  };

  const answerCall = async (callId) => {
    const callDoc = doc(db, "calls", callId);
    const callData = (await getDoc(callDoc)).data();

    peerConnection = new RTCPeerConnection(servers);
    remoteStream = new MediaStream();

    const screenVideo = document.querySelector("#screenVideo");
    screenVideo.srcObject = remoteStream;

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const candidatesCollection = collection(callDoc, "answerCandidates");
        setDoc(doc(candidatesCollection), event.candidate.toJSON());
      }
    };

    const offerDescription = callData.offer;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offerDescription));

    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    const answerDescription = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await setDoc(callDoc, { answer });

    const offerCandidatesCollection = collection(callDoc, "offerCandidates");
    onSnapshot(offerCandidatesCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          peerConnection.addIceCandidate(candidate);
        }
      });
    });
  };

  return (
    <div className={styles.container}>
      <video id="screenVideo" autoPlay className={styles.screen} />
      <div>
        <button onClick={() => shareScreen()}>Share Screen</button>
      </div>
    </div>
  );
};

export default Screen;

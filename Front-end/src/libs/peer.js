let peerConnection = null;
let localStream = null;

import { authStore } from '../store/authStore';

const ICE_SERVERS = {
  iceServers: [
    { urls: ["stun:bn-turn2.xirsys.com"] },
    {
      username:
        "KOo7L3-HXfompS_KFnBUpL2zPDmkLE18D7lfVKqr1bexPhmECxYyB5rcOM9ZYcrmAAAAAGhY84BibGF0aGVyNDAyMQ==",
      credential: "f2f0e73e-4ffa-11f0-b8dc-0242ac140004",
      urls: [
        "turn:bn-turn2.xirsys.com:80?transport=udp",
        "turn:bn-turn2.xirsys.com:3478?transport=udp",
        "turn:bn-turn2.xirsys.com:80?transport=tcp",
        "turn:bn-turn2.xirsys.com:3478?transport=tcp",
      ],
    },
  ],
};

export const createPeerConnection = (remoteVideoRef,  remoteUserId) => {

  const socket = authStore.getState().socket;

  peerConnection = new RTCPeerConnection(ICE_SERVERS);

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('ice-candidate', {
        to: remoteUserId,
        candidate: event.candidate,
      });
    }
  };

  peerConnection.ontrack = (event) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  };

  return peerConnection;
};

export const startLocalStream = async (isVideo) => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: isVideo === "video" ,
      audio: true,
    });
    return localStream;
  } catch (err) {
    console.error('Error accessing camera/mic:', err);
  }
};

export const addTracksToPeer = () => {
  if (localStream && peerConnection) {
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
  }
};

export const createOffer = async (socket, remoteUserId) => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', { to: remoteUserId, offer });
};

export const createAnswer = async (offer, socket, remoteUserId) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('call-accepted', { to: remoteUserId, answer });
};

export const handleAnswer = async (answer) => {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

export const handleNewICECandidate = async (candidate) => {
  if (candidate) {
    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  }
};

export const closeConnection = () => {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  if (localStream) {
    localStream.getTracks().forEach((t) => t.stop());
    localStream = null;
  }
};

import React, { useRef, useEffect } from "react";
import io from "socket.io-client";
import Firebase from 'firebase';
import config from '../../config';

const Test_student = (props) => {

    const userVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const userStream = useRef();
    let  questions = [];
    if (!Firebase.apps.length) {
        console.log("init app")
        Firebase.initializeApp(config);
        const db = Firebase.database().ref('/').child(props.match.params.roomID);
        const getUserData = () => {
            let ref = db
            ref.on('value', snapshot => {
              const state = snapshot.val();
              questions = state;
              console.log('DATA RETRIEVED',questions);
              //  do ui here 
            });
          }
        getUserData()
    }
    
    const invil = useRef();
    
    
    
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;

            socketRef.current = io.connect("/");
            socketRef.current.emit("Stud=>Server:letsInitialize", props.match.params.roomID);

            socketRef.current.on("Server=>Stud:invilFound", invilId => {
                callInvigilator(invilId);
                invil.current = invilId;
            });

            socketRef.current.on("offer_received", handleRecieveCall);

            socketRef.current.on("answer_received", handleAnswer);

            socketRef.current.on("ice-candidate_received", handleNewICECandidateMsg);
        });

    }, []);

    function callInvigilator(invilId) {
        peerRef.current = createPeer(invilId);
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    function createPeer(invilId) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        //peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(invilId);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer({offerToReceiveVideo: false}).then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleRecieveCall(incoming) {
        peerRef.current = createPeer();
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        console.log("anwer")

        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: invil.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }



    return (
            <video autoPlay ref={userVideo} />
    );
};

export default Test_student;
import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import Firebase from "firebase";
import config from "../../config";
import { Container, Row, Col, Button } from "reactstrap";
import QuestionCard from "./QuestionCard";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Test_student = (props) => {
  const userVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const userStream = useRef();
  const [questions, setQuestions] = useState({ questions: [] });

  const invil = useRef();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        userStream.current = stream;

        socketRef.current = io.connect("/");
        socketRef.current.emit(
          "Stud=>Server:letsInitialize",
          props.match.params.roomID
        );

        socketRef.current.on("Server=>Stud:invilFound", (invilId) => {
          callInvigilator(invilId);
          invil.current = invilId;
        });

        socketRef.current.on("offer_received", handleRecieveCall);

        socketRef.current.on("answer_received", handleAnswer);

        socketRef.current.on(
          "ice-candidate_received",
          handleNewICECandidateMsg
        );
      });
    if (!Firebase.apps.length) {
      console.log("init app");
      Firebase.initializeApp(config);
      const db = Firebase.database().ref("/").child(props.match.params.roomID);
      const getUserData = () => {
        let ref = db;
        ref.on("value", (snapshot) => {
          const state = snapshot.val();
          setQuestions(state);
          console.log("DATA RETRIEVED", questions);
          //  do ui here
        });
      };
      getUserData();
    }
  }, [questions]);

  function callInvigilator(invilId) {
    peerRef.current = createPeer(invilId);
    userStream.current
      .getTracks()
      .forEach((track) => peerRef.current.addTrack(track, userStream.current));
  }

  function createPeer(invilId) {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
        {
          urls: "turn:numb.viagenie.ca",
          credential: "muazkh",
          username: "webrtc@live.com",
        },
      ],
    });

    peer.onicecandidate = handleICECandidateEvent;
    //peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(invilId);

    return peer;
  }

  function handleNegotiationNeededEvent(userID) {
    peerRef.current
      .createOffer({ offerToReceiveVideo: false })
      .then((offer) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("offer", payload);
      })
      .catch((e) => console.log(e));
  }

  function handleRecieveCall(incoming) {
    peerRef.current = createPeer();
    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {
        userStream.current
          .getTracks()
          .forEach((track) =>
            peerRef.current.addTrack(track, userStream.current)
          );
      })
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer) => {
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current.emit("answer", payload);
      });
  }

  function handleAnswer(message) {
    console.log("anwer");

    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e) => console.log(e));
  }

  function handleICECandidateEvent(e) {
    if (e.candidate) {
      const payload = {
        target: invil.current,
        candidate: e.candidate,
      };
      socketRef.current.emit("ice-candidate", payload);
    }
  }

  function handleNewICECandidateMsg(incoming) {
    const candidate = new RTCIceCandidate(incoming);

    peerRef.current.addIceCandidate(candidate).catch((e) => console.log(e));
  }

  console.log(userVideo);

  return (
    <Container>
      <Row>
        <Col xs={12} md={{ size: 6, offset: 3 }}>
          <video
            autoPlay
            ref={userVideo}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Col xs={12} md={{ size: 6, offset: 3 }}>
          <Typography variant="h5">Questions</Typography>
          <hr />
        </Col>
      </Row>
      {console.log(questions)}
      {questions.questions.map((que) => (
        <Row>
          <Col xs={12} md={{ size: 6, offset: 3 }}>
            {" "}
            <QuestionCard Question={que} number={que.id} />
          </Col>
        </Row>
      ))}
      <Row style={{ marginBottom: "50px", marginTop: "20px" }}>
        <div className="mx-auto">
          <Button onClick={handleOpen}>Submit</Button>
          <Modal
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className={classes.paper}>
                <Typography variant="h2">Submitted</Typography>
                <Typography> You will get your marks through email!</Typography>
              </div>
            </Fade>
          </Modal>
        </div>
      </Row>
    </Container>
  );
};

export default Test_student;

import React, { Component} from "react";
import io from "socket.io-client";
let stream = null;
export default class Test_invil extends Component{

    constructor (props ){
        super(props);
        this.state = {
            invilVid: null ,
            socketRef: null ,
            otherUser: null ,
            peerRef: null ,
            partnerVideo: null ,
            students : {},
            studentPeers : {}
        }
        this.studentRef = React.createRef();
    }
    
    componentDidMount() {
            this.state.socketRef = io.connect("/");
            this.state.socketRef.emit("Invil=>Server:letsInitialize", this.props.match.params.roomID);
            this.state.socketRef.on("Server=>Invil:newStudent", userID => {
                console.log(`student joined: ${userID}`);
                this.callStudent(userID);
                
                let students = this.state.students;
                students[(userID)] = {};
                this.setState({students})

                this.state.socketRef.on("offer_received", (inc) => this.handleRecieveCall(inc,userID));
    
                this.state.socketRef.on("answer_received", (message) => this.handleAnswer(message,userID));
    
                this.state.socketRef.on("ice-candidate_received", (inc) => this.handleNewICECandidateMsg(inc,userID));
          
            });

    }


    
    callStudent = (studentId) => {
        let peerRef = this.createPeer(studentId);
        
        let studentPeers = this.state.studentPeers;
        studentPeers[studentId] = peerRef 
        this.setState({studentPeers});
        console.log(this.state.studentPeers);
        //userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    createPeer = (studentId) => {
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

        peer.onicecandidate = (e) => this.handleICECandidateEvent(e,studentId);
        peer.ontrack = this.handleTrackEvent;
        peer.onnegotiationneeded = () => {console.log("ok")};

        return peer;
    }
    
    handleICECandidateEvent(e,studentId) {
        if (e.candidate) {
            const payload = {
                target: studentId,
                candidate: e.candidate,
            }
            this.state.socketRef.emit("ice-candidate", payload);
        }
    }

    handleTrackEvent = (e) => {
        console.log(e , "new Track")
        this.studentRef.current.srcObject = e.streams[0];
    }
    handleNegotiationNeededEvent = (studentID) => {
        console.log("something called")
        this.state.studentPeers[studentID].createOffer().then(offer => {
            return this.state.studentPeers[studentID].setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: studentID,
                caller: this.state.socketRef.id,
                sdp: this.state.studentPeers[studentID].localDescription
            };
            this.state.socketRef.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    handleNewICECandidateMsg = (incoming,studentID) => {
        const candidate = new RTCIceCandidate(incoming);

        this.state.studentPeers[studentID].addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    handleRecieveCall = (incoming,studentID) => {
        const desc = new RTCSessionDescription(incoming.sdp);
        this.state.studentPeers[studentID].setRemoteDescription(desc).then(() => {
            //userStream.current.getTracks().forEach(track => this.state.studentPeers[studentID].addTrack(track, userStream.current));
        }).then(() => {
            return this.state.studentPeers[studentID].createAnswer();
        }).then(answer => {
            return this.state.studentPeers[studentID].setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: this.state.socketRef.id,
                sdp: this.state.studentPeers[studentID].localDescription
            }
            this.state.socketRef.emit("answer", payload);
        })
    }

    handleAnswer = (message,studentID) => {
        console.log("answer")
        const desc = new RTCSessionDescription(message.sdp);
        this.state.studentPeers[studentID].setRemoteDescription(desc).catch(e => console.log(e));
    }
    
    render () {
        return (
            <div>
                Vids will appear here...
                Send this to the students:<a href= {"http://localhost:3000/test/"+this.props.match.params.roomID} target="_blank"> {"http://localhost:3000/test/"+this.props.match.params.roomID} </a> 
                {console.log(this.studentRef)};
                <video autoPlay ref = {this.studentRef}/>)
            </div>
        );

    }
};

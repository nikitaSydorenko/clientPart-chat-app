import React, { useState, useEffect, useCallback } from 'react';
import { io }from "socket.io-client";
import './styles.css';
import {CONNECTION_URL} from "./utils/api/ports";
// import TmpComponent from "./TmpComponent";
// import AppContext from "./store";

// let socket;
const App = () => {
    // Before logIn
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [room, setRoom] = useState('');
    const [errors, setErrors] = useState(false);
    const [socket, setSocket] = useState(io(CONNECTION_URL))

    // After logIn
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {
        setSocket(io(CONNECTION_URL))
        // socket = io(CONNECTION_URL);
    },[]);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList([...messageList, data]);
        });
    }, [messageList]);

    // Before logIn handlers
    const handleChangeName = useCallback((event) => {
        setUserName(event.target.value)
    }, []);

    const handleChangeRoom = useCallback((event) => {
        setRoom(event.target.value)
    },[]);

    const connectToRoom = useCallback(() => {
        if(!room && !userName){
            setErrors(true)
        }else {
            setLoggedIn(true)
            socket.emit('join_room', room)
        }

    },[errors, room]);

    // After logIn handlers
    const handleChangeMessage = useCallback((event) => {
        setMessage(event.target.value)
    }, [message]);

    const sendMessage = useCallback(() => {
        let messageContent = {
            room: room,
            content: {
                author: userName,
                message: message
            }
        }
        socket.emit('send_message', messageContent);
        setMessageList([...messageList, messageContent.content])
        setMessage('');
    }, [room, userName, message])

    return (
        <div className="App">
            {!loggedIn ? (
                <div className='logIn'>
                    <div className="inputs">
                        <input type="text" placeholder='Name' onChange={handleChangeName}/>
                        <input type="text" placeholder='Room' onChange={handleChangeRoom}/>
                    </div>
                    {errors ? <span className='err'>Name or Room cannot be empty!</span> : null}
                    <button onClick={connectToRoom} >Enter chat</button>
                </div>
            ) : (
                <div className='chatContainer'>
                    <div className='messages'>
                        {messageList.map((mess, index) => {
                            return (
                                <div key={index} className="messageContainer" id={mess.author === userName ? "You" : "Other"}>
                                    <div className="messageIndividual">
                                        {mess.author === userName ? 'You' : mess.author}: {mess.message}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='messageInputs'>
                        <input type="text" placeholder='Message' onChange={handleChangeMessage} value={message}/>
                        <button onClick={sendMessage}>send</button>
                    </div>
                </div>
            )
            }
        </div>
    )
}

export default App;


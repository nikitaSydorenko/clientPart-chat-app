import React, { useState, useEffect, useCallback } from 'react';
import { io }from "socket.io-client";
import './styles.css';
import {CONNECTION_URL} from "./utils/api/ports";

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [room, setRoom] = useState('');
    const [errors, setErrors] = useState(false);
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        setSocket(io(CONNECTION_URL))
    },[]);

    const handleChangeName = useCallback((event) => {
        setUserName(event.target.value)
    }, []);

    const handleChangeRoom = useCallback((event) => {
        setRoom(event.target.value)
    },[]);

    const connectToRoom = useCallback(() => {
        if(!room || !userName){
            setErrors(true)
        }else {
            setLoggedIn(true)
            socket.emit('join_room', room)
        }
    },[socket, errors]);

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
            ) : <h1>You are logged in</h1> //later I make up the chat container
            }
        </div>
    )
}

export default App;


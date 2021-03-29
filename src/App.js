import React, { useState, useEffect, useCallback } from 'react';
import { io }from "socket.io-client";
import './styles.css';

let socket;
const CONNECTION_PORT = 'http://localhost:3001/';
const App = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [room, setRoom] = useState('');

    useEffect(() => {
        socket = io(CONNECTION_PORT);
    },[CONNECTION_PORT]);

    const handleChangeName = useCallback((event) => {
        setUserName(event.target.value)
    }, []);

    const handleChangeRoom = useCallback((event) => {
        setRoom(event.target.value)
    },[]);

    const connectToRoom = () => {
        setLoggedIn(true)
        socket.emit('join_room', room)
    }
    return (
        <div className="App">
            {!loggedIn ? (
                <div className='logIn'>
                    <div className="inputs">
                        <input type="text" placeholder='Name' onChange={handleChangeName}/>
                        <input type="text" placeholder='Room' onChange={handleChangeRoom}/>
                    </div>
                    <button onClick={connectToRoom}>Enter chat</button>
                </div>
            ) : <h1>You are logged in</h1> //later I make up the chat container
            }
        </div>
    )
}

export default App;

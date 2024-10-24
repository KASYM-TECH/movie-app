import React, {createContext, useContext, useEffect, useState} from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import {login} from "./storage/UserSlice";
import {useDispatch, useSelector} from "react-redux";

const WebSocketContext = createContext(null);

const WebSocketProvider = ({ children }) => {
    const [upd, setUpd] = useState({num:0});
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected");

                // Subscribe to topic updates
                stompClient.subscribe('/topic/updates', (message) => {
                    debugger
                    if(message.body === localStorage.getItem("userId")) {
                        dispatch(login({...userInfo, role: 'Admin'}));
                    }
                    setTimeout(()=> {
                        setUpd((curr) => ({ ...curr, num: curr.num + 1 }));
                    }, 1000)

                });
            },
            onDisconnect: () => {
                console.log("Disconnected");
            }
        });

        stompClient.activate();

        // Clean up on component unmount
        return () => {
            stompClient.deactivate();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{upd}}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketProvider;

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
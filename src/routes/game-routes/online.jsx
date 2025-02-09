import { useEffect, useRef, useState } from "react";
import {  useOutletContext } from "react-router-dom"

export default function GameOnline(){

    const user = useOutletContext();
    const [opponent, setOpponent] = useState(null);
    const opponentRef = useRef(opponent);
    const [sockt,setSocket] = useState(null);
    const [gameState, setGameState] =useState(null);
    const [socketStatus, setSocketStatus] = useState(null); 
    const [error, setError] = useState(null);

    function handleStart(){
        if(!sockt){
            setSocketStatus('Starting');
            const socket = new WebSocket(`ws://localhost:8080/${user.userId}`);
            setSocket(socket);
            setGameState(1)
            socket.addEventListener('open', () => {
                setSocketStatus("Finding a match");
                socket.send(JSON.stringify({}));
            });
            socket.addEventListener('message', (event) => {
                const msg = JSON.parse(event.data.toString());
                console.log('msgObje: ', msg);
                if(msg){
                    switch (msg.type) {
                        case 'oponent':
                            setOpponent(msg.data);
                            setSocketStatus('match-found');
                            setGameState(2);
                            break;
                        case 'timeout':
                            socket.close();
                            setSocket(null);
                            setSocketStatus("No match found");
                            setGameState(1);
                            break;
                        case 'error':
                            setError(msg.message)
                            break;
                        default:
                            break;
                    }
                        
                    if(msg.type === 'text') {
                        console.log('text: ',msg.data);
                    }
                }
            });
            socket.addEventListener("close", ()=>{
                console.log("Server disconnected");
            });
        }
    }

    function findMatchTimeOut(){
        if(!opponentRef.current){
            sockt.close();
            setSocket(null);
            setSocketStatus("No match found");
            setGameState(null)
            setTimeout(()=>{setSocketStatus(null)},1000)
        } 
    }

    function disconnectSocket(){
        if(sockt){
            sockt.close();
        }
    }

    useEffect(() => {
        opponentRef.current = opponent; 
    }, [opponent]);

    useEffect(()=>{
        return ()=>{
            disconnectSocket();
        }
    },[sockt]);

    useEffect(()=>{
        if(sockt){
            const timeoutId = setTimeout(()=>{
                findMatchTimeOut()
            },10000)
            return () => clearTimeout(timeoutId);
        }
    },[sockt])

    if(error){
        return (
            <>
                <p>error</p>
                <br />
                <p>{error}</p>
            </>
        )
    }

    if(!gameState || gameState === 1){
        return (
            <div className="online-game-main">
            <button onClick={handleStart} >{socketStatus ? socketStatus : "Start"}</button>
            </div>
        )
    }

    return (
        <>
            <p>Online</p>
        </>
    )
}
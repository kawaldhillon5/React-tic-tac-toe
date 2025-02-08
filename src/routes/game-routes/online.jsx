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

    console.log(opponent);
    function handleStart(){
        if(!sockt){
            setSocketStatus('Starting');
            const socket = new WebSocket(`ws://localhost:8080/${user.userId}`);
            setSocket(socket);
            socket.addEventListener('open', () => {
                setSocketStatus("Finding a match");
                socket.send(JSON.stringify({type: 'find-match'}));
            });
            socket.addEventListener('message', (event) => {
                const msg = JSON.parse(event.data.toString());
                if(msg){
                    if(msg.type === 'opponent'){
                        setOpponent(msg.data);
                        setSocketStatus('match-found');
                        setGameState(2);
                    } else if(msg.type === 'text') {
                        console.log('text: ',msg.data);
                    }
                }
            });
            
        }
    }

    function findMatchTimeOut(){
        if(!opponentRef.current){
            sockt.close();
            setSocket(null);
            setSocketStatus("No match found");
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
            },6000)
            return () => clearTimeout(timeoutId);
        }
    },[sockt])

    if(!gameState){
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
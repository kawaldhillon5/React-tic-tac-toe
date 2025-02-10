import { useEffect, useRef, useState } from "react";
import {  useOutletContext } from "react-router-dom"

export default function GameOnline(){

    const user = useOutletContext();
    const [opponent, setOpponent] = useState(null);
    const opponentRef = useRef(opponent);
    const [sockt,setSocket] = useState(null);
    const [gameState, setGameState] =useState(null);
    const [gameStateStatus, setGameStateStatus] = useState(null); 
    const [error, setError] = useState(null);

    function handleStart(){
        if(!sockt){
            setGameStateStatus('Starting');
            const socket = new WebSocket(`ws://localhost:8080/${user.userId}`);
            setSocket(socket);
            setGameState(1)
            socket.addEventListener('open', () => {
                setGameStateStatus("Finding a match");
                socket.send(JSON.stringify({type:'find-match'}));
            });
            socket.addEventListener('message', (event) => {
                const msg = JSON.parse(event.data.toString());
                console.log('msgObj: ', msg);
                if(msg){
                    switch (msg.type) {
                        case 'opponent':
                            setOpponent(msg.data);
                            setGameStateStatus('match-found');
                            setTimeout(()=>{
                                setGameState(2);
                                setGameStateStatus('Sending a Toss Request');
                                socket.send(JSON.stringify({type:'toss-request'}));
                                setTimeout(()=>{
                                    setGameStateStatus("Tossing !")
                                },1000)            
                            },1000)
                            break;
                        case 'timeout':
                            socket.close();
                            setSocket(null);
                            setGameStateStatus("No match found");
                            setGameState(1);
                            setTimeout(()=>{
                                setGameStateStatus(null);            
                            },1000)
                            break;
                        case 'toss-results':
                            setTimeout(()=>{
                                console.log(opponentRef); 
                                user.mark = msg.data.userMark
                                setOpponent({...opponentRef.current, mark:msg.data.opponentMark});
                                setGameStateStatus(msg.data.userMark === "X" ? "You Won Toss" : `${opponentRef.current.userName} won Toss`);
                                setGameState(3);
                            },2000)
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
            setGameStateStatus("No match found");
            setGameState(null)
            setTimeout(()=>{
                setGameStateStatus(null);            
            },1000)
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
        if(sockt && opponent){
            const timeoutId = setTimeout(()=>{
                findMatchTimeOut()
            },10000)
            return () => clearTimeout(timeoutId);
        }
    },[sockt, opponent]);

    useEffect(()=>{
        if(gameState === 2 && !opponent.mark){
            const timeoutId = setTimeout(()=>{
                console.log("Toss TimeOut");
                setError("Toss Time Out");
            },5000)
            return () => clearTimeout(timeoutId);
        }
    },[gameState, opponent])

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
            <div className="online-game-mactchmaking-stage">
            <button onClick={handleStart} >{gameStateStatus ? gameStateStatus : "Start"}</button>
            </div>
        )
    }

    if(gameState === 2 && opponent){
        return (
            <div className="online-game-tossing-stage">
                <p>{user.userName} Vs {opponent.userName}</p>
                <p>{gameStateStatus}</p>
            </div>
        )
    }

    if(gameState === 3){
        return (
            <div className="online-game-toss-complete">
                <p>{`${user.userName}(${user.mark})`}  Vs {`${opponent.userName}(${opponent.mark})`}</p>
                <p>{gameStateStatus}</p>
            </div>
        )
    }

    return (
        <>
            <p>Online</p>
        </>
    )
}
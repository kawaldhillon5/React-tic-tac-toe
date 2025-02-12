import { useEffect, useRef, useState } from "react";
import {  data, Navigate, useNavigate, useOutletContext } from "react-router-dom"
import '../../css/online-game.css';
import OnlineBox from "../../components/gameboard-components/onlineBox";

export default function GameOnline(){

    const user = useOutletContext();
    const [opponent, setOpponent] = useState(null);
    const opponentRef = useRef(opponent);
    const [sockt,setSocket] = useState(null);
    const [gameState, setGameState] =useState(null);
    const [gameStateStatus, setGameStateStatus] = useState(null); 
    const [error, setError] = useState(null);
    const currentPlayerTurn = useRef(null);
    const round = useRef(null);
    const matchId = useRef(null);
    const boxRefs = useRef([useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null), useRef(null)]);
    const navigate = useNavigate();
    const [moveTimeout, setMoveTimeOut] = useState(false);

    function handleStart(){
        if(!sockt){
            setGameStateStatus('Starting');
            const socket = new WebSocket(`ws://localhost:5174/${user.userId}`);
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
                                socket.send(JSON.stringify({type: 'begin-match'}));
                                setTimeout(()=>{
                                    setGameState(4);
                                },2000)
                            },2000)
                            break;
                        case 'move':
                            currentPlayerTurn.current = msg.data.playerTurn
                            setGameStateStatus(`${currentPlayerTurn.current.userName}'s Turn`);
                            boxRefs.current[Number(msg.data.position.slice(3))].current.setBoxValue(msg.data.mark);
                            break;
                        case 'match-won':
                            if(msg.data.info){
                                setMoveTimeOut(true);
                            }
                            if(msg.data.positionArray.length){    
                                    msg.data.positionArray.forEach((position)=>{
                                    boxRefs.current[Number(position.slice(3))].current.setBoxClass('won');
                                });
                            }
                            setTimeout(()=>{
                                setGameState(5);
                                if(msg.data.winner === true){
                                    user.score = msg.data.winnerScore;
                                    setOpponent({...opponentRef.current,score:msg.data.opponentScore});
                                    setGameStateStatus(`${user.userName} Won ${msg.data.info ? "Due to "+msg.data.info : ''}`);
                                } else {
                                    user.score = msg.data.opponentScore;
                                    setOpponent({...opponentRef.current,score:msg.data.winnerScore});
                                    setGameStateStatus(`${opponentRef.current.userName} Won ${msg.data.info ? "Due to "+msg.data.info : ''}`);
                                }
                            },2000)
                            break;
                        case 'match-draw':
                                user.score = msg.data.userScore;
                                setOpponent({...opponentRef.current,score:msg.data.opponentScore});
                                setGameStateStatus(`Draw!`);
                                boxRefs.current.forEach(ref => {
                                    ref.current.setBoxClass('draw');
                                });
                                setTimeout(()=>{
                                    setGameState(5);
                                },1000)
                            break;
                        case 'error':
                            setError(msg.message)
                            break;
                        case 'match-initial-info':
                            currentPlayerTurn.current = msg.data.playerTurn
                            setGameStateStatus(`${currentPlayerTurn.current.userName}'s Turn`);
                            round.current = msg.data.round;
                            matchId.current = msg.data.matchId;
                            boxRefs.current.forEach(ref => {
                                ref.current = null;
                            });
                            setGameState(4)
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

    function handleClick(ref){
        if(ref.current && (user.userName === currentPlayerTurn.current.userName) && !moveTimeout ){
            if(ref.current.getBoxValue() === ''){
                ref.current.setBoxValue(user.mark);
                sockt.send(JSON.stringify({type:'move', data:{mark: user.mark, position: ref.current.getBoxId()}}));
            } else if(ref.current.getBoxValue() != ''){
                ref.current.setBoxClass('invalid');
                setTimeout(()=>{
                    ref.current.setBoxClass('');
                },300)
            }
        }
    }

    function handleRestart(){
        sockt.send(JSON.stringify({type:"begin-match"}));
        setGameStateStatus(`Waiting for ${opponent.userName} to Restart`);
    }

    function handleQuit(){
        sockt.send(JSON.stringify({type:"quit-match"}));
        navigate('/')
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
        if(sockt && !opponent){
            const timeoutId = setTimeout(()=>{
                findMatchTimeOut()
            },10000)
            return () => clearTimeout(timeoutId);
        }
    },[sockt, opponent]);

    useEffect(()=>{
        setMoveTimeOut(false);
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
            <div className="online-game-matchmaking-stage">
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

    if(gameState === 4){
        return (
            <div className="online-game-running">
                <p>{gameStateStatus}</p>
                <div className="gameboard-div">
                    {boxRefs.current.map((ref,i)=>(
                        <OnlineBox key={i} handleClick={handleClick} id={`box${i}`} ref={ref}  />
                    ))}
                </div>
            </div>
        )
    }

    if(gameState === 5){
        return (
            <div className="online-game-results">
                <p>{gameStateStatus}</p>
                <div className="scores-div-main">
                    <div className="player-score">
                        <p className="player-score-name">{user.userName}</p>
                        <p className="player-score-score">{user.score}</p>
                    </div>
                    <div className="player-score">
                        <p className="player-score-name">{opponent.userName}</p>
                        <p className="player-score-score">{opponent.score}</p>
                    </div>
                </div>
                <button onClick={handleRestart}>Restart</button>
                <button onClick={handleQuit}>Quit</button>
            </div>
        )
    }

    return (
        <>
            <p>Online</p>
        </>
    )
}
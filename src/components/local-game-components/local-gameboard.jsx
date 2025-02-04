import { useEffect, useRef, useState } from "react"
import Box from "../gameboard-components/box";

export default function LocalGameboard(
    {
        player1,
        player2,
        tossWinner,
        setReset
    }
){
    const [round, setRound] = useState(1);
    const [running, setRunning] = useState(true);
    const [roundWon, setRoundWon] = useState(false);
    const [draw, setDraw] = useState(false); 
    const [playerTurn, setPlayerTurn] = useState(()=>(tossWinner === player1.pName)? player1 :player2);
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const boxRefs = useRef([useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null),useRef(null), useRef(null)]);

    function handleClick(ref){
        if(ref.current && running ){
            if(ref.current.getBoxValue() === ''){
                ref.current.setBoxValue(playerTurn.pMark);
            } else if(ref.current.getBoxValue() != ''){
                ref.current.setBoxClass('invalid');
                setTimeout(()=>{
                    ref.current.setBoxClass('');
                },300)
            }
        }
    }

    function checkDraw(){
        let res = []
        boxRefs.current.forEach(ref => {
            res.push(ref.current.getBoxValue());
        });
        return res;
    }

    function checkWinner(){
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        let roundWon = false;

        for(let i = 0; i < winConditions.length; i++){

            const condition = winConditions[i];
            const cellA = boxRefs.current[condition[0]].current.getBoxValue();
            const cellB = boxRefs.current[condition[1]].current.getBoxValue();
            const cellC = boxRefs.current[condition[2]].current.getBoxValue();

            if(cellA == "" || cellB == "" || cellC == ""){
                continue;
            }
            if(cellA == cellB && cellB == cellC){
                roundWon = true;
                boxRefs.current[condition[0]].current.setBoxClass('won');
                boxRefs.current[condition[1]].current.setBoxClass('won');
                boxRefs.current[condition[2]].current.setBoxClass('won');

                break;
            }
        }

        if(roundWon){
            setRoundWon(true);
            setPlayerTurn(()=>(playerTurn.pName === player1.pName) ? player2: player1);
            (playerTurn.pName === player1.pName) ? setPlayer1Score((prev)=>prev+1): setPlayer2Score((prev)=>prev+1)
        } else if(!checkDraw().includes('')){
            setRunning(false);
            setDraw(true);
        } else {
            setPlayerTurn(()=>(playerTurn.pName === player1.pName) ? player2: player1);
        }

    }

    function restart(){
        setRunning(true);
        setRoundWon(false);
        setDraw(false);
        setRound((round)=>round+1)
        boxRefs.current.forEach((ref)=>{ref.current = null});
    }

    useEffect(()=>{
        if(roundWon){setTimeout(()=>{
            setRunning(false);
        },500)}
    },[roundWon])

    return (
        <div id="local-gameboard-main">
            {running && !roundWon &&
                <div className="gameboard-status">
                    <div className="round-status">Round {round}</div>
                    <div className="player-status">{playerTurn.pName} will place {playerTurn.pMark}</div>
                </div>
            }
            {running ? 
                <div className="gameboard-div">
                    {boxRefs.current.map((ref,i)=>(
                        <Box key={i} handleClick={handleClick} ref={ref} checkWinner={checkWinner} />
                    ))}
                </div> :
                draw ? 
                <div className="draw-div">
                    <p>Draw!</p>
                    <div className="draw-score-div">
                        <div className="draw-p-div">
                            <p>{player1.pName}</p>
                            <p>{player1Score}</p>
                        </div>
                        <div className="draw-p-div">
                            <p>{player2.pName}</p>
                            <p>{player2Score}</p>
                        </div>
                    </div>
                    <button onClick={()=>restart()}>Play Again</button>
                </div>
                :
                <div className="won-div">
                    <p>{playerTurn.pName} Won!</p>
                    <div className="draw-score-div">
                        <div className="draw-p-div">
                            <p>{player1.pName}</p>
                            <p>{player1Score}</p>
                        </div>
                        <div className="draw-p-div">
                            <p>{player2.pName}</p>
                            <p>{player2Score}</p>
                        </div>
                    </div>
                    <button onClick={()=>restart()}>Play Again</button>
                </div>
            }
            <div className="gameboard-buttons">
                <button onClick={()=>{setReset(true)}}>End Game</button>
            </div>
        </div>
    )
}
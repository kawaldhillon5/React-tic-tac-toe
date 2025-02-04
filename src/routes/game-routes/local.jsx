import { useEffect, useState } from "react";
import PlayersForm from "../../components/local-game-components/players-form";
import LocalGameboard from "../../components/local-game-components/local-gameboard";
import Toss from "../../components/local-game-components/local-toss";

export default function GameLocal(){
    const [player1Name, setPlayer1Name] = useState(null);
    const [player2Name, setPlayer2Name] = useState(null);
    const [player1Mark, setPlayer1Mark] = useState(null);
    const [player2Mark, setPlayer2Mark] = useState(null);
    const [tossWinner, setTossWinner] = useState(null);
    const [reset, setReset] = useState(false);

    useEffect(()=>{
        if(reset){
            setPlayer1Name(null);
            setPlayer2Name(null);
            setPlayer1Mark(null);
            setPlayer2Mark(null);
            setTossWinner(null);
            setReset(false);
        }
    },[reset])

    return (
        <div id="game-local-route-main">
            {   (player1Name && player2Name && tossWinner) ?
                <LocalGameboard
                    player1={{pName:player1Name,pMark: player1Mark}}
                    player2={{pName:player2Name,pMark: player2Mark}}
                    tossWinner={tossWinner}
                    setReset={setReset}
                />
                : (!tossWinner &&player1Name && player2Name) ?
                <Toss 
                    player1Name={player1Name}
                    player2Name={player2Name}
                    setTossWinner={setTossWinner}
                />
                : <PlayersForm 
                    setPlayer1Name={setPlayer1Name}
                    setPlayer2Name={setPlayer2Name}
                    setPlayer1Mark={setPlayer1Mark}
                    setPlayer2Mark={setPlayer2Mark}
                />
            }
        </div>
    )
}


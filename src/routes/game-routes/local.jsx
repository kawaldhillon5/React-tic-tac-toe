import { useState } from "react";
import PlayersForm from "../../components/local-game-components/players-form";
import LocalGameboard from "../../components/local-game-components/local-gameboard";

export default function GameLocal(){
    const [player1Name, setPlayer1Name] = useState(null);
    const [player2Name, setPlayer2Name] = useState(null);
    const [player1Mark, setPlayer1Mark] = useState(null);
    const [player2Mark, setPlayer2Mark] = useState(null);
    return (
        <div id="game-local-route-main">
            {   (player1Name && player2Name) ?
                <LocalGameboard />
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
import { useState } from 'react'
import './local-gameboard.css'

export default function PlayersForm(
    {   
        setPlayer1Name,
        setPlayer2Name,
        setPlayer1Mark,
        setPlayer2Mark

    }
){
    const [p1Mark, setP1Mark] = useState(true);
    const [p2Mark, setP2Mark] = useState(false);

    function handleDone(){
        setPlayer1Name(document.querySelector('#player1Name').value);
        setPlayer2Name(document.querySelector('#player2Name').value)
        if(p1Mark){
            setPlayer1Mark('X');
            setPlayer2Mark('O');
        } else{
            setPlayer1Mark('O');
            setPlayer2Mark('X');
        }    
    }

    return (
        <div id='players-form-main'>
            <form className="players-form">
                <fieldset>
                    <legend>Enter Names</legend>
                    <div className="player-group">
                        <div className="input-group-text">
                            <label htmlFor="player1Name">Player 1</label>
                            <input type="text" name="player1Name" id="player1Name"/>
                        </div>
                            <div className="player-radio-labels">
                                <div className="input-group-radio">
                                    <label onClick={()=>{setP1Mark(true);setP2Mark(false)}} htmlFor="player1MarkX" className={`playerMark MarkX ${p1Mark? 'active':""}`}>X</label>
                                    <input type="radio" name="player1Mark" id="player1MarkX" value='X'/>
                                </div>
                                <div className="input-group-radio">
                                    <label onClick={()=>{setP1Mark(false);setP2Mark(true)}} htmlFor="player1MarkO" className={`playerMark MarkO ${!p1Mark? 'active':""}`}>O</label>
                                    <input type="radio" name="player1Mark" id="player1MarkO" value='O'/>
                                </div>
                            </div>
                    </div>
                    <div className="player-group">
                        <div className="input-group-text">
                            <label htmlFor="player2Name">Player 1</label>
                            <input type="text" name="player2Name" id="player2Name"/>
                        </div>
                            <div className="player-radio-labels">
                                <div className="input-group-radio">
                                    <label onClick={()=>{setP2Mark(true);setP1Mark(false)}} htmlFor="player2MarkX" className={`playerMark MarkX ${p2Mark ? 'active':""}`}>X</label>
                                    <input type="radio" name="player2Mark" id="player2MarkX" value='X'/>
                                </div>
                                <div className="input-group-radio">
                                    <label onClick={()=>{setP2Mark(false);setP1Mark(true)}} htmlFor="player2MarkO" className={`playerMark MarkO ${!p2Mark? 'active':""}`}>O</label>
                                    <input type="radio" name="player2Mark" id="player2MarkO" value='O'/>
                                </div>
                            </div>
                    </div>
                    <button onClick={handleDone} type="button">Done</button>
                </fieldset>
            </form>
        </div>
    )
}
import { useNavigate } from "react-router-dom"
import '../css/game.css'
export default function Game(){
    const navigate = useNavigate();
    return (
        <div id="game-main-route">
            <p>Choose Mode</p>
            <button onClick={()=> navigate('../game/local')}>Local</button>
            <button onClick={()=> navigate('../game/online')}>Online</button>
        </div>
    )
}
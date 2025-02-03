import { FaGithub } from 'react-icons/fa'
import '../css/root.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'



export default function Root(){
    const navigate = useNavigate()
    return (
        <>
            <div id="root-header">
                <h2 onClick={()=>{navigate('/')}}>Tic Tac Toe</h2>
                <Link to={'/about'}>About</Link>
            </div>
            <div id="root-content">
                <Outlet></Outlet>
            </div>
            <div id="root-footer">
                <FaGithub/>
                <a href="https://github.com/kawaldhillon5" target="_blank" >Kawal dhillon</a>
            </div>
        </>
    )
}
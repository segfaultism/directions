import { useLocation } from 'react-router-dom'
import NavMenu from '../NavMenu/NavMenu.jsx'
import "./TopBar.css"

const TopBar = () => {
    const { pathname } = useLocation();
    return (
        <div id="top-bar-container">
            <NavMenu />
            {(pathname === "/") ? "Directions" : Array(pathname).shift()[1].toUpperCase() + Array(pathname).shift().toString().slice(2)}
        </div>
    )
}

export default TopBar
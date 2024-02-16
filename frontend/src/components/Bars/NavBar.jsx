import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { SideBarData } from './SideBarData';
import { IconContext } from 'react-icons';
import './NavBar.css';

function NavBar({ onAction }) {
    const [sidebar, setSidebar] = useState(false);
    const navigate = useNavigate();

    const showSidebar = () => setSidebar(!sidebar);

    const handleItemClick = (item) => {
        showSidebar();
        if (item.path && item.path === '/auth'){
            localStorage.removeItem('user');
            navigate(item.path);
        }
        else if (item.action && typeof onAction === 'function') 
            onAction(item.action);
    };

    return (
        <IconContext.Provider value={{ color: '#fff' }}>
            <div className="navbar">
                <Link to="#" className="menu-bars">
                    <FaBars onClick={showSidebar} />
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className="nav-menu-items" onClick={showSidebar}>
                    <li className="navbar-toggle">
                        <Link to="#" className="menu-bars">
                            <AiOutlineClose />
                        </Link>
                    </li>
                    {SideBarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName} onClick={() => handleItemClick(item)}>
                                {item.path ? (
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                ) : (
                                    <div style={{ cursor: 'pointer' }}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </IconContext.Provider>
    );
}

export default NavBar;
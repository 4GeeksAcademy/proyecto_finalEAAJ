import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserPerfil from "./UserPerfil";

export const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(token !== null);
        };

        checkToken(); 
        window.addEventListener('storage', checkToken);
        return () => {
            window.removeEventListener('storage', checkToken);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false); // Update state on logout
    };

    return (
        <nav className="navbar navbar-light bg-light px-4 py-3 shadow-sm" style={{ background: "linear-gradient(to left, #22b455, #1dd1a1, #22b455)", backgroundSize: "200%", transition: "0.3s linear", minHeight: "6.6vh" }}>
            <style>
					{`a {
					color: inherit;
					text-decoration: none;
					}

					details:not([open]) > *:not(summary) {
					display: none !important;
					}

					details {
					position: relative;
					& > summary {
						max-width: max-content;
						list-style: none;
						cursor: pointer;
						-webkit-user-select: none;
						user-select: none;
						border-radius: 0.75rem;
					}
					}

					details > summary > img {
					width: 48px;
					height: auto;
					display: block;
					border-radius: 999rem;
					}

					details[open] img {
					box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.125);
					}

					.menu {
					--space: 0.525rem;
					position: absolute;
					top: initial;
					z-index: 1000;
					right: 0;
					min-width: 16rem;
					width: 100%;
					margin-block: var(--space);
					padding-block: var(--space);
					background-color: white;
					border: 1px solid rgba(0, 0, 0, 0.125);
					border-radius: 0.25rem;
					box-shadow: 0 2px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
					}

					.menu-list {
					display: flex;
					flex-direction: column;
					& > .menu-list--item {
						position: relative;
						padding: 0.75rem 1rem;
						display: grid;
						place-items: center start;
						grid-template-columns: 24px auto;
						column-gap: 0.75rem;
						cursor: pointer;
						list-style: none;
						&:hover {
						background-color: var(--sdcolor);
						}
					}
					}

					.menu-list--item:last-of-type:hover {
					background-color: rgba(255, 0, 0, 0.125);
					}

					.menu-list--item:last-of-type:before {
					content: "";
					position: absolute;
					top: -1px;
					width: 100%;
					height: 1px;
					display: block;
					background-color: rgba(0, 0, 0, 0.125);
					}`}
				</style>
			<div className="container-fluid d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <div className="me-2">
                        <Link to="/">
                            <img src={isAuthenticated ? "/Mo-moneyIcon-Al.png" : "https://api.zoviz.com/lfp?b=K2NLr2r0IWQZfbqE&f=btCSiQWhf6m4&d=1"} alt="Logo" style={{ width: isAuthenticated ? "85%" : "50%", height: isAuthenticated ? "85%" : "50%" }} />
                        </Link>
                    </div>
                </div>
                {isAuthenticated ? (
                    <details id="menu" style={{ width: "8vh" }}>
                        <summary id="menuButton">
                            <img src="/user-profile.png" style={{ width: "100%", height: "100%", display: "grid", placeContent: "center", borderRadius: "50%", position: "relative", boxShadow: "0 1.5em 2em -0.125em #1236", border: "0.125em" }} />
                        </summary>
                        <div className="menu">
                            <div className="menu-list">
                                <div className="menu-list--item">
                                    <i className="bx bx-user bx-sm"></i>
                                    <div className="menu-list--action">View Profile</div>
                                </div>
                                <div className="menu-list--item">
                                    <i className="bx bx-tachometer bx-sm"></i>
                                    <div className="menu-list--action">Dashboard</div>
                                </div>
                                <div className="menu-list--item">
                                    <i className="bx bx-help-circle bx-sm"></i>
                                    <div className="menu-list--action">Help Center</div>
                                </div>
                                <div className="menu-list--item">
                                    <i className="bx bx-gear bx-sm"></i>
                                    <div className="menu-list--action">Settings</div>
                                </div>
                                <div className="menu-list--item" onClick={handleLogout}>
                                    <Link to="/">
                                        <i className='bx bx-arrow-out-right-square-half bx-sm'></i>
                                        <div className="menu-list--action">LogOut</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </details>
                ) : (
                    <div>
                        <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
                        <Link to="/form" className="btn btn-primary">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

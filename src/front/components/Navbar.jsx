import { Link } from "react-router-dom";
import UserPerfil from "./UserPerfil";

export const Navbar = () => {
	return localStorage.getItem('token') !== null ? (
			<nav className="navbar navbar-light bg-light px-4 py-3 shadow-sm" style={{ background: "linear-gradient(to left, #22b455, #1dd1a1, #22b455)",
					backgroundSize: "200%",
					transition: "0.3s linear",
					minHeight: "6.6vh", }}>
				{/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous" />
				<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous" /> */}
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
						<Link to="/" ><img
							src="/Mo-moneyIcon-Al.png"
							alt="Logo"
							style={{ width: "85%", height: "85%"}}
						/></Link>
						{/* <span role="img" aria-label="logo">💸</span> El icono lo he sustituido por una imagen creada en:"https://zoviz.com/es/slogan-generator". Se puede cambiar en cualquier momento*/}
						</div>
						<Link to="/main"><div className="navbar-brand mx-auto fw-bold fs-2" style={{ color: "#B7FF00", fontSize: "10%"}}>Mo’money</div></Link>
					</div>
					<details id="menu" style={{width:"8vh"}} open>
    					<summary id="menuButton">
							<img src="/user-profile.png" style={{ width: "100%", height: "100%", display: "grid", placeContent: "center", borderRadius: "50%",position: "relative", boxShadow: "0 1.5em 2em -0.125em #1236", border: "0.125em",}}>
							</img>
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
							<div className="menu-list--item" onClick={()=>{localStorage.removeItem("token");}}>
							<Link to="/"><i className='bx bx-arrow-out-right-square-half bx-sm'></i>
							<div className="menu-list--action">LogOut</div></Link>
							</div>
						</div>
						</div>
					</details>
				</div>
			</nav>
		) : (
			<nav className="navbar navbar-light bg-light px-4 py-3 shadow-sm" style={{ background: "linear-gradient(to left, #22b455, #1dd1a1, #22b455)",
					backgroundSize: "200%",
					transition: "0.3s linear",
					minHeight: "6.6vh", }}>
				<div className="container-fluid d-flex justify-content-between align-items-center">
					<div className="d-flex align-items-center">
						<div className="me-2">
						<Link to="/"><img
							src="https://api.zoviz.com/lfp?b=K2NLr2r0IWQZfbqE&f=btCSiQWhf6m4&d=1"
							alt="Logo"
							style={{ width: "50%", height: "50%" }}
						/></Link>
						{/* <span role="img" aria-label="logo">💸</span> El icono lo he sustituido por una imagen creada en:"https://zoviz.com/es/slogan-generator". Se puede cambiar en cualquier momento*/}
					</div>
				</div>
				{/* <div className="navbar-brand mx-auto fw-bold fs-2" style={{ color: "#B7FF00" }}>Mo’money</div> */}
				<div>
					<Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
					<Link to="/form" className="btn btn-primary">Register</Link>
				</div>
			</div>
			<div>
				<nav>
					<UserPerfil />
				</nav>
			</div>
		</nav>
	);
};

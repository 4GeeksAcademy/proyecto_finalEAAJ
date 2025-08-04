import { Link } from "react-router-dom";
import UserPerfil from "./UserPerfil";

export const Navbar = () => {
	return localStorage.getItem('token') !== null ? (
		<nav className="navbar navbar-light bg-light px-4 py-3 shadow-sm" style={{
			background: "linear-gradient(to left, #22b455, #1dd1a1, #22b455)",
			backgroundSize: "200%",
			transition: "0.3s linear",
			minHeight: "6.6vh",
		}}>
			<div className="container-fluid d-flex justify-content-between align-items-center">
				<div className="d-flex align-items-center">
					<div className="me-2">
						<Link to="/main"><img
							src="/Mo-moneyIcon-Al.png"
							alt="Logo"
							style={{ width: "50%", height: "50%" }}
						/></Link>
						{/* <span role="img" aria-label="logo">💸</span> El icono lo he sustituido por una imagen creada en:"https://zoviz.com/es/slogan-generator". Se puede cambiar en cualquier momento*/}
					</div>
				</div>
				{/* <div className="navbar-brand mx-auto fw-bold fs-2" style={{ color: "#B7FF00" }}>Mo’money</div> */}
				<div class="dropdown">
					<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						Dropdown button
					</button>
					<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
						<a class="dropdown-item" href="#">Action</a>
						<a class="dropdown-item" href="#">Another action</a>
						<a class="dropdown-item" href="#">Something else here</a>
					</div>
				</div>
			</div>
		</nav>
	) : (
		<nav className="navbar navbar-light bg-light px-4 py-3 shadow-sm" style={{
			background: "linear-gradient(to left, #22b455, #1dd1a1, #22b455)",
			backgroundSize: "200%",
			transition: "0.3s linear",
			minHeight: "6.6vh",
		}}>
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

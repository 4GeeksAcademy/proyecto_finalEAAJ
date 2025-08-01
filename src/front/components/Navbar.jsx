import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container d-flex justify-content-between align-items-center">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Mo’money</span>
				</Link>

				<div className="d-flex align-items-center gap-3">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context</button>
					</Link>
					<UserMenu />
				</div>
			</div>
		</nav>
	);
};

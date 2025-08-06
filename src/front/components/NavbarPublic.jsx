import { Link } from "react-router-dom";

export const NavbarPublic = () => {
  return (
    <nav
      className="navbar navbar-light bg-light px-4 py-3 shadow-sm"
      style={{
        background: "linear-gradient(to left, #22b455, #1dd1a1, #22b455)",
        backgroundSize: "200%",
        transition: "0.3s linear",
        minHeight: "6.6vh",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div className="me-2">
            <Link to="/">
              <img
                src="https://api.zoviz.com/lfp?b=K2NLr2r0IWQZfbqE&f=btCSiQWhf6m4&d=1"
                alt="Logo"
                style={{ width: "50%", height: "50%" }}
              />
            </Link>
          </div>
        </div>
        <div>
          <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
          <Link to="/form" className="btn btn-primary">Register</Link>
        </div>
      </div>
    </nav>
  );
};

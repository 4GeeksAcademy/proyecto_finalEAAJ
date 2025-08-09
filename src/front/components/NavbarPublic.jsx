import { Link } from "react-router-dom";

export const NavbarPublic = () => {
  return (
    <nav
      className="navbar navbar-light bg-light px-4 py-3 shadow-sm"
      style={{
        background: "linear-gradient(to left,  #f4ffc4, #b7ff00, #f4ffc4)",
        backgroundSize: "100%",
        transition: "0.3s linear",
        minHeight: "6.6vh",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <div>
            <Link to="/">
              <img
                src="/Mo-moneyIcon2.webp"
                /* src="https://api.zoviz.com/lfp?b=K2NLr2r0IWQZfbqE&f=btCSiQWhf6m4&d=1" */
                alt="Logo"
                style={{ width: "8vh", height: "8vh" }}
              />
            </Link>
          </div>
              <Link to="/" className="navbar-brand fw-bold text-white" style={{fontSize: "4.5vh"}}>
                Mo’money
            </Link>
        </div>
        <div>
          <Link to="/login" className="btn  me-2" style={{backgroundColor:"#7bff00"}}>Login</Link>
          <Link to="/form" className="btn " style={{backgroundColor:"#7bff00"}}>Register</Link>
        </div>
      </div>
    </nav>
  );
};

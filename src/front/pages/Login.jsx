import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const [identificador, setIdentificador] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identificador, password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                // Guardar token
                const token = data.access_token || data.token;
                localStorage.setItem("token", token);

                // Guardar username directo (para Navbar)
                if (data.user?.username) {
                    localStorage.setItem("username", data.user.username);
                }

                
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                
                try {
                    const dineroRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/dinero`, {
                        headers: { Authorization: "Bearer " + token },
                    });
                    const dineroInfo = await dineroRes.json();
                    localStorage.setItem("dineroTotal", dineroInfo.dinero_total);


                } catch (err) {
                    console.error("Error trayendo dinero:", err);
                }

                navigate("/main");
            } else {
                setMessage("⛔ " + (data.msg || "Error al iniciar sesión."));
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 10000);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage("⛔ Error al iniciar sesión, intenta de nuevo.");
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 10000);
        }
    };

    return (
        <div
            style={{
                backgroundColor: "white",
                color: "#000",
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                paddingTop: "8rem",
                paddingBottom: "2rem",
            }}
        >
            <form
                onSubmit={handleLogin}
                style={{
                    border: "2px solid #B7FF00",
                    padding: "2rem",
                    borderRadius: "10px",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    backgroundColor: "white",
                    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Iniciar Sesión</h2>

                <div>
                    <label>Usuario o Email:</label><br />
                    <input
                        type="text"
                        value={identificador}
                        onChange={(e) => setIdentificador(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #B7FF00",
                            backgroundColor: "white",
                            color: "#000",
                            borderRadius: "4px",
                        }}
                    />
                </div>

                <div>
                    <label>Contraseña:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #B7FF00",
                            backgroundColor: "white",
                            color: "#000",
                            borderRadius: "4px",
                        }}
                    />
                </div>

                <div>
                    <p style={{ color: "black" }}>
                        ¿Olvidaste tu contraseña?{" "}
                        <Link to="/forgotpassword" style={{ color: "#95cf00ff", textDecoration: "underline" }}>
                            Recuperar
                        </Link>
                    </p>
                    <p style={{ color: "black" }}>
                        ¿Todavía no tienes un usuario?{" "}
                        <Link to="/form" style={{ color: "#95cf00ff", textDecoration: "underline" }}>
                            Regístrate
                        </Link>
                    </p>
                </div>

                <button
                    type="submit"
                    style={{
                        backgroundColor: "#B7FF00",
                        color: "#000",
                        padding: "10px",
                        border: "none",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    Iniciar Sesión
                </button>
            </form>

            {showMessage && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20vh",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        padding: "2.5vh 5vh",
                        borderRadius: "5px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                        zIndex: 1000,
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "/user-profile.png";
import Swal from "sweetalert2";

const PasswordValidation = ({ password }) => {
  if (!password) return null;

  const isLongEnough = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  return (
    <div className="password-validation mt-2">
      <p className="password-validation-title">Tu contraseña debe incluir:</p>
      <ul className="password-validation-list ps-3">
        <li className={isLongEnough ? "text-success" : "text-danger"}>
          {isLongEnough ? "✅" : "❌"} Al menos 8 caracteres
        </li>
        <li className={hasLetter ? "text-success" : "text-danger"}>
          {hasLetter ? "✅" : "❌"} Letras (a-z)
        </li>
        <li className={hasUppercase ? "text-success" : "text-danger"}>
          {hasUppercase ? "✅" : "❌"} Una letra mayúscula (A-Z)
        </li>
        <li className={hasNumber ? "text-success" : "text-danger"}>
          {hasNumber ? "✅" : "❌"} Un número (0-9)
        </li>
      </ul>
    </div>
  );
};

export const Formulario = () => {
  const [situacion, setSituacion] = useState(null);
  const [sueldoEstudiante, setSueldoEstudiante] = useState("");
  const [sueldoTrabajador, setSueldoTrabajador] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pais, setPais] = useState("");
  const [prefijo, setPrefijo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [perfil, setPerfil] = useState("/user-profile.png");
  const navigate = useNavigate();

  const prefijos = {
    Alemania: "+49",
    Austria: "+43",
    Bélgica: "+32",
    Chipre: "+357",
    Croacia: "+385",
    Eslovaquia: "+421",
    Eslovenia: "+386",
    España: "+34",
    Estonia: "+372",
    Finlandia: "+358",
    Francia: "+33",
    Grecia: "+30",
    Irlanda: "+353",
    Italia: "+39",
    Letonia: "+371",
    Lituania: "+370",
    Luxemburgo: "+352",
    Malta: "+356",
    "Países Bajos": "+31",
    Portugal: "+351",
  };

  useEffect(() => {
    if (pais && prefijos[pais]) {
      setPrefijo(prefijos[pais]);
    }
  }, [pais]);

  const sueldoFinal = situacion === "estudiante" ? sueldoEstudiante : sueldoTrabajador;

  const calcularAhorro = () => {
    const valor = parseFloat(sueldoFinal);
    if (isNaN(valor)) return 0;
    return (valor * 0.2).toFixed(2);
  };

  const situacionBoolean = () => situacion === "estudiante";

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    username: usuario,
    email: email,
    password: password,
    firstname: nombre,
    lastname: apellidos,
    country: pais,
    phone: prefijo + telefono,
    sueldo: sueldoFinal,
    dinero_disponible: situacion === "estudiante" ? sueldoEstudiante : null,
    is_student: situacionBoolean(),
    perfil: perfil,
    isNewUser: true,
  };



  

try {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}api/user/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  //console.log("📥 Status de respuesta:", response.status);

  const data = await response.json();
  //console.log("📥 Respuesta del servidor:", data);

  if (response.status === 201) {
    if (data.token) {
      localStorage.setItem("token", data.token);
      //console.log("🔑 Token guardado en localStorage");
    }

    // ✅ Éxito con botón verde y letras negras
    Swal.fire({
      title: "Usuario registrado con éxito ",
      confirmButtonText: "Continuar",
      confirmButtonColor: "#7bff00",
      customClass: {
        confirmButton: "text-black"
      }
    }).then(() => {
      navigate("/main");
    });

  } else {
    // ❌ Error controlado
    Swal.fire({
      title: "Error",
      text: data.error || "Error al registrar usuario ❌",
      confirmButtonText: "Reintentar",
      confirmButtonColor: "#7bff00",
      customClass: {
        confirmButton: "text-black"
      }
    });
  }

} catch (err) {
  console.error("🚨 Error en el registro:", err);
  Swal.fire({
    title: "Hubo un problema con el servidor ❌",
    confirmButtonText: "Cerrar",
    confirmButtonColor: "#7bff00",
    customClass: {
      confirmButton: "text-black"
    }
  });
}}

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#ffffff", minHeight: "80vh" }}>
      <form className="w-100" style={{ maxWidth: "600px", margin: "1vh", borderRadius: "8px", padding: "0px" }} onSubmit={handleSubmit}>
        <div className="text-center"><h1>Formulario</h1></div>
        <div className="p-5 rounded shadow-lg" style={{ backgroundColor: "#ffffff", border: "3px solid #b7ff00", borderRadius: "8px", padding: "20px" }}>

          {/* Nombre */}
          <div className="mb-4" >
            <label className="form-label">Nombre</label>
            <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          {/* Apellidos */}
          <div className="mb-4">
            <label className="form-label">Apellidos</label>
            <input type="text" className="form-control" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
          </div>

          {/* Usuario */}
          <div className="mb-4">
            <label className="form-label">Nombre de Usuario</label>
            <input type="text" className="form-control" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            <PasswordValidation password={password} />
          </div>

          {/* País */}
          {/* <div className="mb-4">
            <select className="form-select mb-4" value={pais} onChange={(e) => setPais(e.target.value)} required>
              <option disabled value="">¿Dónde vives?</option>
              <option value="Alemania">Alemania</option>
              <option value="Austria">Austria</option>
              <option value="Bélgica">Bélgica</option>
              <option value="Chipre">Chipre</option>
              <option value="Croacia">Croacia</option>
              <option value="Eslovaquia">Eslovaquia</option>
              <option value="Eslovenia">Eslovenia</option>
              <option value="España">España</option>
              <option value="Estonia">Estonia</option>
              <option value="Finlandia">Finlandia</option>
              <option value="Francia">Francia</option>
              <option value="Grecia">Grecia</option>
              <option value="Irlanda">Irlanda</option>
              <option value="Italia">Italia</option>
              <option value="Letonia">Letonia</option>
              <option value="Lituania">Lituania</option>
              <option value="Luxemburgo">Luxemburgo</option>
              <option value="Malta">Malta</option>
              <option value="Países Bajos">Países Bajos</option>
              <option value="Portugal">Portugal</option>
            </select>
          </div>

          {/* Teléfono }
          <div className="mb-4">
            <label className="form-label">Contacto</label>
            <div className="d-flex gap-2">
              <select className="form-select text-secondary" value={prefijo} style={{ width: '30%' }} onChange={(e) => setPrefijo(e.target.value)} required>
                <option value="" disabled>Selecciona tu prefijo</option>
                <option value="+49">(+49) Alemania</option>
                <option value="+43">(+43) Austria</option>
                <option value="+32">(+32) Bélgica</option>
                <option value="+357">(+357) Chipre</option>
                <option value="+385">(+385) Croacia</option>
                <option value="+421">(+421) Eslovaquia</option>
                <option value="+386">(+386) Eslovenia</option>
                <option value="+34">(+34) España</option>
                <option value="+372">(+372) Estonia</option>
                <option value="+358">(+358) Finlandia</option>
                <option value="+33">(+33) Francia</option>
                <option value="+30">(+30) Grecia</option>
                <option value="+353">(+353) Irlanda</option>
                <option value="+39">(+39) Italia</option>
                <option value="+371">(+371) Letonia</option>
                <option value="+370">(+370) Lituania</option>
                <option value="+352">(+352) Luxemburgo</option>
                <option value="+356">(+356) Malta</option>
                <option value="+31">(+31) Países Bajos</option>
                <option value="+351">(+351) Portugal</option>
              </select>
              <input type="tel" className="form-control" required onChange={(e) => setTelefono(e.target.value)} />
            </div>
          </div> */}

          {/* País */}
          <div className="mb-4">
            <select
              className="form-select mb-4"
              value={pais}
              onChange={(e) => setPais(e.target.value)}
              required
            >
              <option disabled value="">
                ¿Dónde vives?
              </option>
              {Object.keys(prefijos).map((nombrePais) => (
                <option key={nombrePais} value={nombrePais}>
                  {nombrePais}
                </option>
              ))}
            </select>
          </div>

          {/* Teléfono */}
          <div className="mb-4">
            <label className="form-label">Contacto</label>
            <div className="d-flex gap-2">
              <select
                className="form-select text-secondary"
                value={prefijo}
                style={{ width: "30%" }}
                onChange={(e) => setPrefijo(e.target.value)} // Este cambio NO afecta al país
                required
              >
                <option value="" disabled>
                  Selecciona tu prefijo
                </option>
                {Object.entries(prefijos).map(([nombrePais, codigo]) => (
                  <option key={codigo} value={codigo}>
                    ({codigo}) {nombrePais}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                className="form-control"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
          </div>

          {/* Situación */}
          <div className="mb-4 text-center">
            <label className="form-label">Cuéntame algo sobre ti</label>
            <div className="mb-4 d-flex justify-content-center">
              <button type="button" className="btn me-2" onClick={() => setSituacion("estudiante")}
                style={{
                  backgroundColor: situacion === "estudiante" ? "#b7ff00" : "white",
                  border: "2px solid #b7ff00"
                }}>
                Soy estudiante
              </button>

              <button type="button" className="btn" onClick={() => setSituacion("trabajador")}
                style={{
                  backgroundColor: situacion === "trabajador" ? "#b7ff00" : "white",
                  border: "2px solid #b7ff00"
                }}>
                Tengo trabajo
              </button>
            </div>

            {/* Campos de sueldo */}
            <div className="mb-3 pt-3">
              <label className="form-label">¿Cuánto dispones al mes?</label>
              <input
                type="number"
                className="form-control"
                placeholder="€"
                disabled={situacion !== "estudiante"}
                onChange={(e) => setSueldoEstudiante(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">¿Cuál es tu sueldo neto?</label>
              <input
                type="number"
                className="form-control"
                placeholder="€"
                disabled={situacion !== "trabajador"}
                onChange={(e) => setSueldoTrabajador(e.target.value)}
              />
            </div>
          </div>

          {sueldoFinal && !isNaN(parseFloat(sueldoFinal)) && (
            <div className="alert" style={{ backgroundColor: "#b7ff00" }}>
              💰 Deberías ahorrar mensualmente: <strong>{calcularAhorro()} €</strong> (20%)
            </div>
          )}

          <div className="mb-3 d-flex justify-content-center">
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#b7ff00", color: "black" }}>
              Crear Usuario
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

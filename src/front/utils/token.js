export function checkTokenExpiration() {
  const token = localStorage.getItem("token");

  if (!token) return false; // No hay token

  try {
    // Los JWT tienen 3 partes separadas por ".", el payload está en la segunda
    const payloadBase64 = token.split(".")[1];
    const payloadDecoded = JSON.parse(atob(payloadBase64));

    if (!payloadDecoded.exp) return false; 

    const expiryDate = payloadDecoded.exp * 1000;
    const now = Date.now();

    if (now >= expiryDate) {
      localStorage.removeItem("token");
      return true;
    }

    return false; // Aún no expiró
  } catch (error) {
    console.error("Error decodificando token:", error);
    localStorage.removeItem("token"); // Si es inválido lo borramos
    return true;
  }
}
export async function refreshToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "api/user/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      }
    });

    if (!resp.ok) throw new Error("Error al refrescar token");

    const data = await resp.json();
    if (data.token) {
      localStorage.setItem("token", data.token); // Guardamos el nuevo token
      //console.log("🔄 Token refrescado ");//, data.token);
      return data.token;
    }
  } catch (err) {
    console.error("❌ Error refrescando token:", err);
    localStorage.removeItem("token"); // si falla borramos token
    return null;
  }
}
let canRefresh = true; // bandera
export async function refreshTokenWithCooldown() {
  if (!canRefresh) return; // si aún no pasó el tiempo, no hacemos nada

  canRefresh = false;
  await refreshToken();

  // Esperar 2.5 minutos antes de permitir otro refresh
  setTimeout(() => {
    canRefresh = true;
  }, 150000); // 150000 ms = 2.5 minutos
}
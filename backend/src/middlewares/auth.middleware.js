import jwt from "jsonwebtoken"; // Importa la librería jsonwebtoken para manejar tokens JWT

// Lee el JWT desde la cookie "token" y deja los datos del usuario en req.user.
export const isAuth = (req, res, next) => { // Middleware de autenticación
  const token = req.cookies.token; // Lee el token desde la cookie "token"
  if (!token) return res.status(401).json({ message: "No autenticado" }); // Si no hay token, devuelve un error 401 (No autenticado)

  try { // Intenta verificar el token
    req.user = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token usando la clave secreta y guarda los datos del usuario en req.user
    next(); // Llama a la siguiente función de middleware si el token es válido
  } catch { // Si el token es inválido o ha expirado, devuelve un error 401 (Token inválido o vencido)
    res.status(401).json({ message: "Token inválido o vencido" }); // Devuelve un error 401 (Token inválido o vencido)
  }
}; 

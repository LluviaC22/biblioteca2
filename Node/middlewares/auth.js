import jwt from 'jsonwebtoken';

// Middleware para verificar el token 
export const verifyToken = async (req, res, next) => {
  // Obtener el token desde el header Authorization
  const token = req.headers['authorization']?.split(' ')[1];

  // Si no se proporciona el token, en envia error 403
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar el token con la clave secreta
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Si el token es válido, agrega el id_usuario al request
    req.id_usuario = decoded.id_usuario;
    
    // Continuamos con la siguiente función del middleware
    next();
  } catch (err) {
    // Si hay un error, retorna un mensaje de error 401
    return res.status(401).json({ message: 'Token no válido' });
  }
};

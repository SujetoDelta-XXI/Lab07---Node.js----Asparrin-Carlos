import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
  try {
    let token = null;

    // ✅ Buscar token en header (para Postman) o en cookie (para navegador)
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'No autorizado: falta token' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.userRoles = payload.roles || [];

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token no válido o caducado' });
  }
}

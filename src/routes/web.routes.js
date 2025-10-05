import { Router } from 'express';
import authenticate from '../middlewares/authenticate.js';
import userRepository from '../repositories/UserRepository.js';

const router = Router();

// Página de inicio (login)
router.get('/', (req, res) => {
  res.render('signin'); // O 'home' si tienes una vista de bienvenida
});

// Página de registro
router.get('/signUp', (req, res) => res.render('signup'));

// Dashboard: solo users y admins
router.get('/dashboard', authenticate, async (req, res) => {
  const user = await userRepository.findById(req.userId);
  const roles = (user.roles || []).map(r => r.name);

  if (roles.includes('admin')) {
    const users = await userRepository.findAll();
    res.render('dashboard_admin', { users });
  } else if (roles.includes('user')) {
    res.render('dashboard_user', { user });
  } else {
    res.status(403).render('403');
  }
});

// Perfil de usuario (autenticado)
router.get('/profile', authenticate, async (req, res) => {
  const me = await userRepository.findById(req.userId);
  res.render('profile', { user: me });
});

// Ruta acceso denegado (403)
router.get('/403', (req, res) => {
  res.status(403).render('403');
});

// Catch-all para 404
router.get('*', (req, res) => res.status(404).render('404'));

export default router;
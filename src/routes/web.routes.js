import { Router } from 'express';
import authenticate from '../middlewares/authenticate.js';
import userRepository from '../repositories/UserRepository.js';

const router = Router();

// 👉 Página de inicio
router.get('/', (req, res) => {
  res.render('signin'); // o 'home' si creas una vista de bienvenida
});

router.get('/signIn', (req, res) => res.render('signin'));
router.get('/signUp', (req, res) => res.render('signup'));

router.get('/profile', authenticate, async (req, res) => {
  const me = await userRepository.findById(req.userId);
  res.render('profile', { user: me });
});

router.get('/dashboard', authenticate, async (req, res) => {
  if (!req.userRoles.includes('admin')) {
    return res.status(403).render('403', { message: 'Acceso denegado' });
  }
  const users = await userRepository.findAll();
  res.render('dashboard', { users });
});

// 👉 404 al final
router.get('*', (req, res) => res.status(404).render('404'));

export default router;

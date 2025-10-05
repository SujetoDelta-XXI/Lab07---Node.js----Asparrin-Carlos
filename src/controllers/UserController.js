import userRepository from '../repositories/UserRepository.js';

class UsersController {
  async getAll(req, res, next) {
    try {
      const users = await userRepository.findAll().select('-password');
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await userRepository.findById(req.userId).select('-password');
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

export default new UsersController();

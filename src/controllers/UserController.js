import userRepository from '../repositories/UserRepository.js';

class UsersController {
  async getAll(req, res, next) {
    try {
      const users = await userRepository.findAll().select('-password');
      // Transforma los roles de cada usuario en array de strings
      const usersData = users.map(u => ({
        ...u.toObject(),
        roles: (u.roles || []).map(r => r.name)
      }));
      res.json(usersData);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await userRepository.findById(req.userId).select('-password');
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
      // Transforma los roles en array de strings
      const userData = {
        ...user.toObject(),
        roles: (user.roles || []).map(r => r.name)
      };
      res.json(userData);
    } catch (err) {
      next(err);
    }
  }
}

export default new UsersController();
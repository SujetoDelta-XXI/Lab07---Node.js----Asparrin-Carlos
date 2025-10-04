import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

/**
 * Crea dos usuarios iniciales: uno admin y otro normal
 */
export default async function seedUsers() {
  try {
    // Roles requeridos
    const adminRole = await roleRepository.findByName('admin') ||
      await roleRepository.create({ name: 'admin' });

    const userRole = await roleRepository.findByName('user') ||
      await roleRepository.create({ name: 'user' });

    // Usuarios iniciales
    const usersToSeed = [
      {
        name: 'Admin Seed',
        email: 'admin@demo.com',
        password: 'Admin#2025',
        roles: [adminRole._id]
      },
      {
        name: 'User Seed',
        email: 'user@demo.com',
        password: 'User#2025',
        roles: [userRole._id]
      }
    ];

    for (const u of usersToSeed) {
      const exists = await userRepository.findByEmail(u.email);
      if (!exists) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashed = await bcrypt.hash(u.password, saltRounds);

        await userRepository.create({
          name: u.name,
          email: u.email,
          password: hashed,
          roles: u.roles
        });

        console.log(`Usuario creado: ${u.email}`);
      } else {
        console.log(`Usuario ya existe: ${u.email}`);
      }
    }
  } catch (error) {
    console.error('Error al sembrar usuarios iniciales:', error);
  }
}

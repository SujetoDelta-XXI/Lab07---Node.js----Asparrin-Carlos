import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import webRoutes from './routes/web.routes.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';
import ejsMate from 'ejs-mate';
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
app.engine('ejs', ejsMate);  

// EJS
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Estáticos
app.use(express.static('public'));

// Habilitar CORS para todos
app.use(cors());

app.use(express.json());

app.use(cookieParser());

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Rutas WEB (EJS)
app.use('/', webRoutes);

// Validar estado del servidor
app.get('/health', (req, res) => res.status(200).json({ ok: true }));

// Manejador global de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
    .then( async () => {
        console.log('Mongo connected');
        await seedRoles();
        await seedUsers();  
        app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
    })
    .catch(err => {
        console.error('Error al conectar con Mongo:', err);
        process.exit(1);
    });




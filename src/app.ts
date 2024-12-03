import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './models/User';
import express from 'express';
import userRoutes from './routes/userRoutes';
import { Note } from './models/Note';
import cors from 'cors';

export const AppDataSource = new DataSource({
    type: 'mysql',                // Cambia el tipo de base de datos
    host: 'localhost',            // Host de tu base de datos
    port: 3306,                   // Puerto predeterminado de MySQL
    username: 'root',       // Usuario de MySQL (generalmente "root")
    password: '',    // Contraseña del usuario
    database: 'organizador', // Nombre de tu base de datos
    entities: [User, Note],  // Pasando directamente las entidades en lugar de una cadena
    //[__dirname + '/models/*.ts'], // Ruta a tus entidades
    synchronize: true,            // Sincroniza entidades automáticamente
    // logging: false,
    // migrations: [],
    // subscribers: [],
});

const app = express();
const port = 3000;

AppDataSource.initialize()
    .then(() => {
        console.log('Conexión a la base de datos establecida');
    })
    .catch((err) => {
        console.error('Error conectando a la base de datos:', err);
    });

// Middleware CORS - Permitir solicitudes desde el frontend (puerto 5173)
app.use(cors({
    origin: 'http://localhost:5173', // Permitir solicitudes solo desde este origen (frontend)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));

// Middleware
app.use(express.json());

// Rutas
app.use('/api', userRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

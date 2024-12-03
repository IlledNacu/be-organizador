import { Request, Response } from 'express';
import { AppDataSource } from '../app';
import { User } from '../models/User';
//import bcrypt from 'bcrypt';

// export const registerUser = async (req: Request, res: Response): Promise<void> => {
//     const { name, email, password } = req.body;

//     try {
//         if (!name || !email || !password) {
//             res.status(400).json({ error: 'Todos los campos son obligatorios' });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const userRepository = AppDataSource.getRepository(User);
//         const newUser = userRepository.create({
//             name,
//             email,
//             password: hashedPassword,
//         });
//         const savedUser = await userRepository.save(newUser);

//         res.status(201).json(savedUser);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error al registrar usuario' });
//     }
// };

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);

        const existingUser = await userRepository.findOne({
            where: { email: email },
        });

        if (!existingUser) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isPasswordValid = password == existingUser!.password;

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        res.json({ message: 'Inicio de sesión exitoso', user: existingUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al iniciar sesión' });
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOne({
            where: { id: Number(id) },
            relations: ['notes'],
        });

        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

export const putUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: Number(id) } });

        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        const updatedUser = await userRepository.save(user);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const userRepository = AppDataSource.getRepository(User);

        // Verificar si el usuario existe
        const user = await userRepository.findOne({ where: { id: Number(id) } });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        // Eliminar el usuario
        await userRepository.delete(id);

        // Responder con éxito (sin contenido)
        res.status(204).send(); // O bien, puedes devolver un mensaje si prefieres:
        // res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};
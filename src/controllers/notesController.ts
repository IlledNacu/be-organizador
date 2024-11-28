import { Request, Response } from 'express';
import { AppDataSource } from '../app';
import { Note } from '../models/Note';

export const getNotes = async (req: Request, res: Response): Promise<void> => {
    const { creatorId } = req.params;

    try {
        const noteRepository = AppDataSource.getRepository(Note);

        const notes = await noteRepository.find({
            where: { creator: { id: Number(creatorId) } },
            relations: ['creator'],
        });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las notas del usuario' });
    }
};

export const getNote = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const noteRepository = AppDataSource.getRepository(Note);

        const note = await noteRepository.findOne({
            where: { id: Number(id) },
            relations: ['creator'],
        });

        if (!note) {
            res.status(404).json({ error: 'Nota no encontrada' });
        }

        res.json(note);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la nota' });
    }
};

export const postNote = async (req: Request, res: Response): Promise<void> => {
    const { title, body, creator } = req.body;

    try {
        if (!title || !body) {
            res.status(400).json({ error: 'El título y el cuerpo de la nota son obligatorios' });
            return;
        }

        const noteRepository = AppDataSource.getRepository(Note);
        const newNote = noteRepository.create({ title, body, creator });
        const savedNote = await noteRepository.save(newNote);

        res.status(201).json(savedNote);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la nota' });
    }
};

export const putNote = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { title, body } = req.body;

    try {
        const noteRepository = AppDataSource.getRepository(Note);
        const note = await noteRepository.findOne({ where: { id: Number(id) } });

        if (!note) {
            res.status(404).json({ error: 'Nota no encontrada' });
            return;
        }

        note.title = title ?? note.title;
        note.body = body ?? note.body;

        const updatedNote = await noteRepository.save(note);
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la nota' });
    }
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const noteRepository = AppDataSource.getRepository(Note);

        const note = await noteRepository.findOne({ where: { id: Number(id) } });
        if (!note) {
            res.status(404).json({ error: 'Nota no encontrada' });
            return;
        }

        await noteRepository.delete(id);

        // Responder con éxito (sin contenido)
        res.status(204).send(); // O bien, puedes devolver un mensaje si prefieres:
        // res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la nota' });
    }
};
import { Router } from 'express';
import { deleteUser, getUser, getUsers, login, putUser, registerUser } from '../controllers/userController';
import { deleteNote, getNote, getNotes, postNote, putNote } from '../controllers/notesController';

const router = Router();

//Usuarios
router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.put('/users/:id', putUser);
router.delete('/users/:id', deleteUser);
router.post('/users/login', login);
router.post('/users/register', registerUser);

//Notas
router.get('/notes/:creatorId', getNotes);
router.get('/note/:id', getNote);
router.post('/notes', postNote);
router.put('/notes/:id', putNote);
router.delete('/notes/:id', deleteNote);


export default router;

